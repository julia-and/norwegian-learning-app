import { pathToFileURL } from "url";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MAX_TEXT_LENGTH = 5000;

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowed === "*" ? "*" : origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildSystemPrompt(level) {
  return `You are a Norwegian (Bokmål) language tutor. The student is at CEFR ${level} level.

Correct their Norwegian text. For each clear error:
1. Quote the original text
2. Provide the corrected version
3. Explain why in English
4. Note the grammar rule if applicable

Also provide:
- An overall assessment (1-2 sentences in Norwegian)
- 3-5 vocabulary suggestions (Norwegian words relevant to their topic that they could incorporate)
- A fluency rating from 1 to 5 (1 = many errors, 5 = near-native)
- Informational notes for observations that are NOT errors (style tips, alternative phrasings, cultural context)

Important rules:
- Only include items in "corrections" if the original is clearly incorrect. If a word choice is acceptable but a slightly more natural alternative exists, put it in "notes" instead — never in "corrections".
- Do not contradict yourself. If the student's phrasing is grammatically valid, do not mark it as an error.
- Both the feminine article "ei" and the masculine article "en" are acceptable for masculine+feminine nouns (eg hytte, dør, hake).
- Do not penalize for obvious typographical errors.
${
  level === "A1" || level === "A2"
    ? `- At ${level} level, ONLY correct: V2 rule violations, sentence structure errors, gender errors, and conjugation errors. Word choice, style, and specificity observations belong in "notes", not "corrections".
- A technically correct sentence should never appear as a correction, even if a more specific or natural phrasing exists.`
    : `- At ${level} level, nuanced word choice and style feedback is appropriate in "corrections" when clearly unnatural, otherwise use "notes".`
}

If the text has no errors, say so and still provide vocabulary suggestions, notes, and assessment.

Respond ONLY with valid JSON in this exact format:
{
  "corrections": [
    { "original": "...", "corrected": "...", "explanation": "...", "rule": "..." }
  ],
  "correctedText": "the full corrected text",
  "assessment": "vurderingsoversikt",
  "assessmentEn": "assessment overview",
  "vocabularySuggestions": ["word1 - meaning", "word2 - meaning"],
  "notes": ["Informational note about style or alternative phrasing"],
  "fluencyRating": 3
}`;
}

export const handle = async (event, context, callback) => {
  const origin = event.headers?.origin || "";
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server misconfigured: missing API key" }),
    };
  }

  let text, level;
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    text = body.text;
    level = body.level;
  } catch {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Missing or empty "text" field' }),
    };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
      }),
    };
  }

  const validLevels = ["A1", "A2", "B1", "B2", "C1"];
  if (!level || !validLevels.includes(level)) {
    level = "A2";
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: buildSystemPrompt(level),
        messages: [
          {
            role: "user",
            content: `Please correct this Norwegian text:\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        statusCode: 502,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: `Upstream API error (${response.status})`,
        }),
      };
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) {
      return {
        statusCode: 502,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No response from upstream API" }),
      };
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        statusCode: 502,
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Could not parse correction response" }),
      };
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

// Local testing
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  import("@scaleway/serverless-functions").then(scw => {
    scw.serveHandler(handle, 8080);
  });
}

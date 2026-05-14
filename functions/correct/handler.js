import { pathToFileURL } from "url";
import { authorize, jsonResponse, serverError } from "./_shared/cors-and-auth.js";
import { parseClaudeJson } from "./_shared/parse-claude-json.js";
import { callAnthropic, extractText } from "./_shared/anthropic.js";

const MAX_TEXT_LENGTH = 5000;
const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

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

export const handle = async event => {
  const auth = authorize(event);
  if (!auth.ok) return auth.response;
  const { headers, body } = auth;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, headers, { error: "Server misconfigured: missing API key" });
  }

  const text = body.text;
  let level = body.level;

  if (!text || typeof text !== "string" || !text.trim()) {
    return jsonResponse(400, headers, { error: 'Missing or empty "text" field' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return jsonResponse(400, headers, {
      error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters`,
    });
  }
  if (!level || !VALID_LEVELS.includes(level)) level = "A2";

  try {
    const data = await callAnthropic({
      apiKey,
      model: "claude-haiku-4-5-20251001",
      maxTokens: 2048,
      system: buildSystemPrompt(level),
      messages: [
        { role: "user", content: `Please correct this Norwegian text:\n\n${text}` },
      ],
    });

    const content = extractText(data);
    if (!content) {
      return jsonResponse(502, headers, { error: "No response from upstream API" });
    }

    const result = parseClaudeJson(content, {
      required: ["corrections", "correctedText", "fluencyRating"],
      shape: {
        corrections: "array",
        correctedText: "string",
        fluencyRating: "number",
        vocabularySuggestions: "array",
        notes: "array",
      },
    });

    return jsonResponse(200, headers, result);
  } catch (err) {
    if (err.status) {
      return jsonResponse(502, headers, { error: err.message });
    }
    return serverError(headers, err);
  }
};

// Local testing
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  import("@scaleway/serverless-functions").then(scw => {
    scw.serveHandler(handle, 8080);
  });
}

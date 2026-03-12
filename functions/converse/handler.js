import { pathToFileURL } from "url";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

function corsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": allowed === "*" ? "*" : origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function buildSystemPrompt(scenario, level, turnCount, maxTurns) {
  const maxSentences = level === "A1" || level === "A2" ? 2 : 3;
  const isWrappingUp = turnCount >= maxTurns - 1;

  const levelInstructions = {
    A1: "Use ONLY present tense, simple common nouns, and basic phrases. Avoid complex grammar entirely. Very short sentences.",
    A2: "Use present tense and simple past tense. Basic conjunctions (og, men, fordi). Keep sentences short and clear.",
    B1: "Use varied tenses, modal verbs, and subordinate clauses. Natural everyday Norwegian.",
    B2: "Use complex sentence structures and idiomatic expressions. Fully natural conversational Norwegian.",
    C1: "Use sophisticated vocabulary and grammar. Fully fluent, natural Norwegian with nuance.",
  };

  return `You are ${scenario.role}. You are in this situation: ${scenario.title}.

CRITICAL RULES:
1. ALWAYS respond ONLY in Norwegian (Bokmål). Never use any English.
2. Vocabulary and grammar MUST match CEFR level ${level}: ${levelInstructions[level] || levelInstructions["A2"]}
3. Write MAXIMUM ${maxSentences} sentences in your reply.
4. Stay strictly on-topic. If the learner goes off-topic, gently redirect the conversation back.
${isWrappingUp ? "5. IMPORTANT: This is the final exchange — wrap up the conversation naturally (complete the transaction, say goodbye, etc.)." : ""}

Respond with ONLY valid JSON in this exact format:
{
  "reply": "Your Norwegian response (max ${maxSentences} sentences)",
  "isComplete": ${turnCount >= maxTurns ? "true" : "false"},
  "hint": "A single Norwegian phrase the learner could say next (5-10 words)"
}`;
}

export const handle = async (event, context, callback) => {
  const origin = event.headers?.origin || "";
  const headers = corsHeaders(origin);

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

  let messages, scenario, level, turnCount, maxTurns;
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    messages = body.messages;
    scenario = body.scenario;
    level = body.level || "A2";
    turnCount = typeof body.turnCount === "number" ? body.turnCount : 0;
    maxTurns = typeof body.maxTurns === "number" ? body.maxTurns : 4;
  } catch {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: 'Missing or empty "messages" array' }),
    };
  }

  if (!scenario || !scenario.role || !scenario.title) {
    return {
      statusCode: 400,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing required scenario fields" }),
    };
  }

  const validLevels = ["A1", "A2", "B1", "B2", "C1"];
  if (!validLevels.includes(level)) level = "A2";

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
        max_tokens: 512,
        system: buildSystemPrompt(scenario, level, turnCount, maxTurns),
        messages,
      }),
    });

    if (!response.ok) {
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
        body: JSON.stringify({ error: "Could not parse conversation response" }),
      };
    }

    const result = JSON.parse(jsonMatch[0]);
    // Enforce isComplete when we've reached max turns
    if (turnCount >= maxTurns) {
      result.isComplete = true;
    }

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
  import("@scaleway/serverless-functions").then((scw) => {
    scw.serveHandler(handle, 8081);
  });
}

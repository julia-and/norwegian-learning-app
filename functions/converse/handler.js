import { pathToFileURL } from "url";
import { authorize, jsonResponse, serverError } from "./_shared/cors-and-auth.js";
import { parseClaudeJson } from "./_shared/parse-claude-json.js";
import { callAnthropic, extractText } from "./_shared/anthropic.js";
import { SCENARIOS } from "./_shared/scenarios.js";

const VALID_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

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

export const handle = async event => {
  const auth = authorize(event);
  if (!auth.ok) return auth.response;
  const { headers, body } = auth;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, headers, { error: "Server misconfigured: missing API key" });
  }

  const messages = body.messages;
  const scenarioId =
    body.scenarioId || (body.scenario && body.scenario.id) || null;
  let level = body.level || "A2";
  const turnCount = typeof body.turnCount === "number" ? body.turnCount : 0;
  const maxTurnsOverride = typeof body.maxTurns === "number" ? body.maxTurns : null;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return jsonResponse(400, headers, { error: 'Missing or empty "messages" array' });
  }
  if (!scenarioId || typeof scenarioId !== "string") {
    return jsonResponse(400, headers, { error: 'Missing "scenarioId"' });
  }
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) {
    return jsonResponse(400, headers, { error: `Unknown scenarioId: ${scenarioId}` });
  }
  if (!VALID_LEVELS.includes(level)) level = "A2";
  const maxTurns = maxTurnsOverride || scenario.maxTurns;

  try {
    const data = await callAnthropic({
      apiKey,
      model: "claude-haiku-4-5-20251001",
      maxTokens: 512,
      system: buildSystemPrompt(scenario, level, turnCount, maxTurns),
      messages,
    });

    const content = extractText(data);
    if (!content) {
      return jsonResponse(502, headers, { error: "No response from upstream API" });
    }

    const result = parseClaudeJson(content, {
      required: ["reply"],
      shape: { reply: "string", isComplete: "boolean", hint: "string" },
    });
    if (turnCount >= maxTurns) result.isComplete = true;

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
    scw.serveHandler(handle, 8081);
  });
}

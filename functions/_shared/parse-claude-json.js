/**
 * Robust extraction + validation of a JSON object from a Claude text response.
 *
 * Claude responses sometimes wrap JSON in ```json fences or include a leading
 * sentence. We strip fences, locate the outer object, and parse. Then we
 * validate against a minimal hand-written schema (no Zod — keep this zero-dep
 * so it deploys to Scaleway without bundling).
 *
 * `schema` shape:
 *   { required: ['key1', ...], shape: { key1: 'string' | 'number' | 'array' | 'object' } }
 *
 * Returns the parsed object on success or throws a descriptive Error.
 */

const TYPE_OF = {
  string: v => typeof v === "string",
  number: v => typeof v === "number" && Number.isFinite(v),
  boolean: v => typeof v === "boolean",
  array: v => Array.isArray(v),
  object: v => v !== null && typeof v === "object" && !Array.isArray(v),
};

function stripFences(text) {
  // ```json\n{...}\n```  or  ```\n{...}\n```
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) return fence[1];
  return text;
}

function extractObject(text) {
  // Find the first '{' and walk to its matching '}' accounting for
  // nested braces and string literals (handles escapes).
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\" && inString) {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export function parseClaudeJson(content, schema = {}) {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Empty Claude response");
  }
  const cleaned = stripFences(content);
  const objText = extractObject(cleaned);
  if (!objText) throw new Error("No JSON object found in Claude response");

  let parsed;
  try {
    parsed = JSON.parse(objText);
  } catch (err) {
    throw new Error(`JSON.parse failed: ${err.message}`);
  }

  const required = schema.required || [];
  for (const key of required) {
    if (!(key in parsed)) {
      throw new Error(`Required key missing from Claude response: ${key}`);
    }
  }

  const shape = schema.shape || {};
  for (const [key, type] of Object.entries(shape)) {
    if (!(key in parsed)) continue; // shape is advisory; required handled above
    const check = TYPE_OF[type];
    if (!check) continue;
    if (!check(parsed[key])) {
      throw new Error(
        `Claude response key '${key}' has wrong type (expected ${type})`
      );
    }
  }

  return parsed;
}

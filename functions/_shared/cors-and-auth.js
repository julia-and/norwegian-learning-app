/**
 * Shared CORS allowlist + shared-secret authorization for Scaleway functions.
 *
 * Env:
 *   ALLOWED_ORIGINS   (comma-separated; back-compat reads singular ALLOWED_ORIGIN)
 *   APP_SHARED_SECRET (required; rejects 401 if header `x-app-secret` mismatches)
 *
 * NOTE: This shared secret is anti-abuse, not authentication. The secret is
 * shipped in the static client JS and visible in DevTools. It stops casual
 * bots and accidental web crawlers from running up Anthropic spend.
 */

function parseAllowed() {
  const csv = process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "";
  return csv
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

function originHeader(origin, allowed) {
  if (allowed.includes("*")) return "*";
  if (origin && allowed.includes(origin)) return origin;
  return null;
}

export function buildHeaders(origin) {
  const allowed = parseAllowed();
  const allowOrigin = originHeader(origin, allowed);
  const h = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-app-secret",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };
  if (allowOrigin) h["Access-Control-Allow-Origin"] = allowOrigin;
  return h;
}

export function jsonResponse(statusCode, headers, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

/**
 * Validate the request and return { ok: true, headers, body } on success, or
 * { ok: false, response } where response is ready to return.
 *
 * On success, callers receive the parsed JSON body and the CORS headers to
 * attach to their final response.
 */
export function authorize(event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const headers = buildHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { ok: false, response: { statusCode: 204, headers, body: "" } };
  }

  if (event.httpMethod !== "POST") {
    return {
      ok: false,
      response: jsonResponse(405, headers, { error: "Method not allowed" }),
    };
  }

  const allowed = parseAllowed();
  // If an Origin header is present (browser request), it must be on the
  // allowlist. Non-browser callers (no Origin header) bypass this check and
  // rely solely on the shared secret.
  if (origin && !allowed.includes("*") && !allowed.includes(origin)) {
    return {
      ok: false,
      response: jsonResponse(403, headers, { error: "Origin not allowed" }),
    };
  }

  const expectedSecret = process.env.APP_SHARED_SECRET;
  if (!expectedSecret) {
    console.error("[auth] APP_SHARED_SECRET not configured");
    return {
      ok: false,
      response: jsonResponse(500, headers, {
        error: "Server misconfigured",
      }),
    };
  }
  const providedSecret =
    event.headers?.["x-app-secret"] || event.headers?.["X-App-Secret"];
  if (providedSecret !== expectedSecret) {
    return {
      ok: false,
      response: jsonResponse(401, headers, { error: "Unauthorized" }),
    };
  }

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return {
      ok: false,
      response: jsonResponse(400, headers, { error: "Invalid JSON body" }),
    };
  }

  return { ok: true, headers, body: body || {} };
}

export function serverError(headers, err) {
  console.error("[handler] internal error:", err);
  return jsonResponse(500, headers, { error: "Internal server error" });
}

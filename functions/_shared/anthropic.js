/**
 * Anthropic API client with retry + backoff on transient failures.
 *
 * Returns the parsed JSON body of a successful response, or throws an Error
 * with the upstream status attached as `.status` for the caller to surface
 * as a 502.
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

function isRetryable(status) {
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function callAnthropic({ apiKey, model, system, messages, maxTokens }) {
  const apiVersion = process.env.ANTHROPIC_API_VERSION || "2023-06-01";
  const maxAttempts = 3;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": apiVersion,
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system,
          messages,
        }),
      });
      if (res.ok) {
        return await res.json();
      }
      if (!isRetryable(res.status) || attempt === maxAttempts) {
        const text = await res.text().catch(() => "");
        const err = new Error(
          `Upstream API error (${res.status}): ${text.slice(0, 200)}`
        );
        err.status = res.status;
        throw err;
      }
      console.warn(
        `[anthropic] attempt ${attempt} returned ${res.status}; retrying`
      );
    } catch (err) {
      lastErr = err;
      if (err.status && !isRetryable(err.status)) throw err;
      if (attempt === maxAttempts) throw err;
      console.warn(`[anthropic] attempt ${attempt} threw; retrying:`, err.message);
    }
    await sleep(2 ** (attempt - 1) * 500); // 500, 1000, 2000ms
  }
  throw lastErr || new Error("Anthropic call failed");
}

export function extractText(data) {
  return data?.content?.[0]?.text || null;
}

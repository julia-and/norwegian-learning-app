/**
 * Thin wrapper around fetch() for the Scaleway proxy functions.
 *
 * - Adds the `x-app-secret` header (anti-abuse; visible in shipped JS but
 *   stops casual bots from running up Anthropic spend).
 * - Surfaces upstream errors with their message.
 * - Validates the response shape at runtime so downstream consumers can rely
 *   on TypeScript types rather than `as Foo` casts hiding malformed JSON.
 */

const SHARED_SECRET = process.env.NEXT_PUBLIC_APP_SHARED_SECRET || '';

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface ResponseSchema {
  required?: string[];
  shape?: Record<string, FieldType>;
}

function typeOk(value: unknown, type: FieldType): boolean {
  switch (type) {
    case 'string': return typeof value === 'string';
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'boolean': return typeof value === 'boolean';
    case 'array':  return Array.isArray(value);
    case 'object': return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}

function validate<T>(data: unknown, schema: ResponseSchema): T {
  if (!data || typeof data !== 'object') {
    throw new Error('Malformed response: not an object');
  }
  const rec = data as Record<string, unknown>;
  for (const key of schema.required ?? []) {
    if (!(key in rec)) {
      throw new Error(`Malformed response: missing key "${key}"`);
    }
  }
  for (const [key, type] of Object.entries(schema.shape ?? {})) {
    if (key in rec && !typeOk(rec[key], type)) {
      throw new Error(`Malformed response: key "${key}" has wrong type (expected ${type})`);
    }
  }
  return data as T;
}

export async function proxyFetch<T>(
  url: string | undefined,
  body: unknown,
  schema: ResponseSchema,
  configName: string,
): Promise<T> {
  if (!url) {
    throw new Error(
      `${configName} is not configured. Check the corresponding NEXT_PUBLIC_*_API_URL env var.`,
    );
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(SHARED_SECRET ? { 'x-app-secret': SHARED_SECRET } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    const msg = errBody?.error || `API error (${response.status})`;
    throw new Error(msg);
  }

  const data = await response.json();
  return validate<T>(data, schema);
}

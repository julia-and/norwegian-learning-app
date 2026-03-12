export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  rule?: string;
}

export interface CorrectionResult {
  corrections: Correction[];
  correctedText: string;
  assessment: string;
  vocabularySuggestions: string[];
  fluencyRating: number;
  notes?: string[];
}

const PROXY_URL = process.env.NEXT_PUBLIC_CORRECTION_API_URL;

export async function correctNorwegianText(
  text: string,
  level: string,
): Promise<CorrectionResult> {
  if (!PROXY_URL) {
    throw new Error(
      'Writing corrections are not configured. The NEXT_PUBLIC_CORRECTION_API_URL environment variable is missing.',
    );
  }

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, level }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(body.error || `API error (${response.status})`);
  }

  return (await response.json()) as CorrectionResult;
}

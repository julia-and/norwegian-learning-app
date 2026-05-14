import { proxyFetch } from '@/lib/api-client';

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
  return proxyFetch<CorrectionResult>(
    PROXY_URL,
    { text, level },
    {
      required: ['corrections', 'correctedText', 'fluencyRating'],
      shape: {
        corrections: 'array',
        correctedText: 'string',
        fluencyRating: 'number',
        vocabularySuggestions: 'array',
      },
    },
    'Writing corrections',
  );
}

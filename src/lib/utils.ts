import { format, subDays } from 'date-fns';
import type { CEFRLevel } from '@/lib/resources';

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatMinutes(seconds: number): string {
  const m = Math.round(seconds / 60);
  if (m < 1) return '<1 min';
  if (m === 1) return '1 min';
  return `${m} min`;
}

/**
 * Returns ISO date strings for the last `days` days, oldest first
 * (i.e. dateRange(3) → [today-2, today-1, today]).
 */
export function dateRange(days: number): string[] {
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return out;
}

/** Fisher–Yates shuffle. Returns a new array; does not mutate the input. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const CEFR_LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export function isCEFRLevel(v: unknown): v is CEFRLevel {
  return typeof v === 'string' && (CEFR_LEVELS as readonly string[]).includes(v);
}

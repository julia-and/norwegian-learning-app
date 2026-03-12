import type { Category, TimerCategory } from './db';

export const CATEGORY_CONFIG: Record<TimerCategory, {
  label: string;
  emoji: string;
  color: string;
  colorVar: string;
}> = {
  reading:    { label: 'Lesing',    emoji: '📖', color: '#4A90D9', colorVar: 'var(--color-reading)' },
  writing:    { label: 'Skriving',  emoji: '✍️', color: '#45A065', colorVar: 'var(--color-writing)' },
  listening:  { label: 'Lytting',   emoji: '🎧', color: '#8B5FC7', colorVar: 'var(--color-listening)' },
  speaking:   { label: 'Snakking',  emoji: '🗣️', color: '#E07B39', colorVar: 'var(--color-speaking)' },
  vocabulary: { label: 'Ordforråd', emoji: '📝', color: '#C4473A', colorVar: 'var(--color-vocabulary)' },
};

export const REVIEW_STATUS_CONFIG: Record<string, { label: string; variant: string }> = {
  new:      { label: 'Ny',      variant: 'default' },
  learning: { label: 'Lærer',   variant: 'accent' },
  known:    { label: 'Kan',     variant: 'success' },
};

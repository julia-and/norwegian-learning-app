'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { subDays, format } from 'date-fns';
import { db, type WritingSubmission, type SelfCorrectionAttempt } from '@/lib/db';
import type { CorrectionResult } from '@/lib/claude';
import { todayISO } from '@/lib/utils';

export function useWritingHistory() {
  const submissions = useLiveQuery(
    () => db.writingSubmissions.orderBy('createdAt').reverse().toArray()
  ) ?? [];

  const totalCount = submissions.length;
  const totalWords = submissions.reduce((sum, s) => sum + s.wordCount, 0);
  const avgFluency = totalCount > 0
    ? submissions.reduce((sum, s) => sum + s.fluencyRating, 0) / totalCount
    : 0;

  const allAttempts = submissions.flatMap(s => s.selfCorrections);
  const attemptedCorrections = allAttempts.filter(a => !a.skipped);
  const selfCorrectionAccuracy = attemptedCorrections.length > 0
    ? attemptedCorrections.filter(a => a.wasCorrect).length / attemptedCorrections.length
    : 0;

  async function saveSubmission(params: {
    promptId: string | null;
    promptText: string;
    level: string;
    originalText: string;
    correctionResult: CorrectionResult;
    selfCorrections: SelfCorrectionAttempt[];
  }) {
    const wordCount = params.originalText.trim().split(/\s+/).length;
    const submission: WritingSubmission = {
      id: crypto.randomUUID(),
      date: todayISO(),
      promptId: params.promptId,
      promptText: params.promptText,
      level: params.level,
      originalText: params.originalText,
      wordCount,
      correctionResult: params.correctionResult,
      fluencyRating: params.correctionResult.fluencyRating,
      selfCorrections: params.selfCorrections,
      createdAt: new Date(),
    };
    await db.writingSubmissions.add(submission);
    return submission;
  }

  return {
    submissions,
    totalCount,
    totalWords,
    avgFluency,
    selfCorrectionAccuracy,
    saveSubmission,
  };
}

export function useFluencyOverTime(days: number = 30) {
  const submissions = useLiveQuery(
    () => db.writingSubmissions.toArray()
  ) ?? [];

  const result: { date: string; avgFluency: number; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const daySubmissions = submissions.filter(s => s.date === date);
    const count = daySubmissions.length;
    const avgFluency = count > 0
      ? daySubmissions.reduce((sum, s) => sum + s.fluencyRating, 0) / count
      : 0;
    result.push({ date, avgFluency, count });
  }
  return result;
}

'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { subDays, format, parseISO } from 'date-fns';
import { db } from '@/lib/db';
import { todayISO } from '@/lib/utils';

export function useStats() {
  const allCheckoffs = useLiveQuery(() => db.dailyCheckoffs.toArray()) ?? [];
  const allSessions = useLiveQuery(() => db.timerSessions.toArray()) ?? [];
  const taskCount = useLiveQuery(() => db.practiceTasks.where('isActive').equals(1).count()) ?? 0;
  const vocabCount = useLiveQuery(() =>
    db.vocabEntries.where('reviewStatus').anyOf('learning', 'known').count()
  ) ?? 0;

  const currentStreak = calculateStreak(allCheckoffs.map(c => c.date));
  const longestStreak = calculateLongestStreak(allCheckoffs.map(c => c.date));

  const today = todayISO();
  const todayCheckoffs = allCheckoffs.filter(c => c.date === today);
  const todayCompletion = taskCount > 0
    ? new Set(todayCheckoffs.map(c => c.taskId)).size / taskCount
    : 0;

  const todaySessions = allSessions.filter(s => s.date === today);
  const todaySessionSeconds = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const todayCheckoffMinutes = todayCheckoffs.reduce((sum, c) => sum + (c.durationMinutes ?? 0), 0);
  const todayStudySeconds = todaySessionSeconds + todayCheckoffMinutes * 60;

  return {
    currentStreak,
    longestStreak,
    todayCompletion,
    todayStudySeconds,
    todayCheckoffCount: new Set(todayCheckoffs.map(c => c.taskId)).size,
    taskCount,
    vocabCount,
    allCheckoffs,
    allSessions,
  };
}

function calculateStreak(dates: string[]): number {
  const unique = [...new Set(dates)].sort().reverse();
  if (unique.length === 0) return 0;

  const today = todayISO();
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (unique[0] !== today && unique[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const expected = format(subDays(parseISO(unique[i - 1]), 1), 'yyyy-MM-dd');
    if (unique[i] === expected) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(dates: string[]): number {
  const unique = [...new Set(dates)].sort();
  if (unique.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < unique.length; i++) {
    const expected = format(subDays(parseISO(unique[i]), -1), 'yyyy-MM-dd');
    const prev = unique[i - 1];
    const prevNext = format(subDays(parseISO(prev), -1), 'yyyy-MM-dd');
    if (unique[i] === prevNext) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function useCompletionByDay(days: number = 30) {
  const checkoffs = useLiveQuery(() => db.dailyCheckoffs.toArray()) ?? [];
  const taskCount = useLiveQuery(() => db.practiceTasks.where('isActive').equals(1).count()) ?? 0;

  const result: { date: string; rate: number; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayCheckoffs = checkoffs.filter(c => c.date === date);
    const uniqueTasks = new Set(dayCheckoffs.map(c => c.taskId)).size;
    result.push({
      date,
      rate: taskCount > 0 ? uniqueTasks / taskCount : 0,
      count: uniqueTasks,
    });
  }
  return { data: result, taskCount };
}

export function useTimeByCategory(days: number = 30) {
  const sessions = useLiveQuery(() => db.timerSessions.toArray()) ?? [];
  const checkoffs = useLiveQuery(() => db.dailyCheckoffs.toArray()) ?? [];
  const tasks = useLiveQuery(() => db.practiceTasks.toArray()) ?? [];

  const taskCategoryMap = new Map(tasks.map(t => [t.id, t.category]));

  const result: Record<string, { date: string; reading: number; writing: number; listening: number; speaking: number; vocabulary: number }> = {};
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    result[date] = { date, reading: 0, writing: 0, listening: 0, speaking: 0, vocabulary: 0 };
  }

  for (const session of sessions) {
    if (result[session.date]) {
      result[session.date][session.category] += Math.round(session.durationSeconds / 60);
    }
  }

  for (const checkoff of checkoffs) {
    if (checkoff.durationMinutes && result[checkoff.date]) {
      const category = taskCategoryMap.get(checkoff.taskId);
      if (category) {
        result[checkoff.date][category] += checkoff.durationMinutes;
      }
    }
  }

  return Object.values(result);
}

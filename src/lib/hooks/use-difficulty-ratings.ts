'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { subDays, format } from 'date-fns';
import { db } from '@/lib/db';
import { todayISO } from '@/lib/utils';

export function useDifficultyOverTime(days: number = 30) {
  const ratings = useLiveQuery(() => db.difficultyRatings.toArray()) ?? [];

  const result: { date: string; avgRating: number; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const dayRatings = ratings.filter(r => r.date === date);
    const count = dayRatings.length;
    const avgRating = count > 0
      ? dayRatings.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;
    result.push({ date, avgRating, count });
  }
  return result;
}

export function useTodayRatings() {
  return useLiveQuery(
    () => db.difficultyRatings.where('date').equals(todayISO()).toArray()
  ) ?? [];
}

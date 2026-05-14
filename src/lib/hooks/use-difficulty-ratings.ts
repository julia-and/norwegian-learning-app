'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { todayISO, dateRange } from '@/lib/utils';

export function useDifficultyOverTime(days: number = 30) {
  const ratings = useLiveQuery(() => db.difficultyRatings.toArray()) ?? [];

  return dateRange(days).map(date => {
    const dayRatings = ratings.filter(r => r.date === date);
    const count = dayRatings.length;
    const avgRating = count > 0
      ? dayRatings.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;
    return { date, avgRating, count };
  });
}

export function useTodayRatings() {
  return useLiveQuery(
    () => db.difficultyRatings.where('date').equals(todayISO()).toArray()
  ) ?? [];
}

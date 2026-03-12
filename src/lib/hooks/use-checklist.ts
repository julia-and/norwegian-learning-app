'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { format, addDays, subDays } from 'date-fns';
import { useState } from 'react';
import { db } from '@/lib/db';
import type { Category } from '@/lib/db';
import { todayISO } from '@/lib/utils';

export function useChecklist(initialDate?: string) {
  const [dateStr, setDateStr] = useState(initialDate || todayISO());
  const isToday = dateStr === todayISO();

  const allActiveTasks = useLiveQuery(
    () => db.practiceTasks.where('isActive').equals(1).sortBy('order'),
    []
  ) ?? [];

  const dayBit = 1 << new Date(dateStr + 'T12:00:00').getDay();
  const tasks = allActiveTasks.filter(t => ((t.activeDays ?? 127) & dayBit) !== 0);

  const allCheckoffs = useLiveQuery(
    () => db.dailyCheckoffs.where('date').equals(dateStr).toArray(),
    [dateStr]
  ) ?? [];

  const checkoffs = allCheckoffs.filter(c => c.taskId !== 'adhoc');
  const adHocCheckoffs = allCheckoffs.filter(c => c.taskId === 'adhoc');

  const completedIds = new Set(checkoffs.map(c => c.taskId));
  const completionRate = tasks.length > 0 ? completedIds.size / tasks.length : 0;

  const toggleTask = async (taskId: string) => {
    const existing = await db.dailyCheckoffs
      .where('[taskId+date]').equals([taskId, dateStr]).first();

    if (existing) {
      await db.dailyCheckoffs.delete(existing.id);
    } else {
      await db.dailyCheckoffs.add({
        id: crypto.randomUUID(),
        taskId,
        date: dateStr,
        completedAt: new Date(),
      });
    }
  };

  const updateCheckoff = async (id: string, completedAt: Date, durationMinutes?: number, notes?: string) => {
    await db.dailyCheckoffs.update(id, { completedAt, durationMinutes, notes });
  };

  const addAdHocCheckoff = async (label: string, adHocCategory: Category, durationMinutes?: number) => {
    await db.dailyCheckoffs.add({
      id: crypto.randomUUID(),
      taskId: 'adhoc',
      date: dateStr,
      completedAt: new Date(),
      label,
      adHocCategory,
      durationMinutes,
    });
  };

  const deleteAdHoc = async (id: string) => {
    await db.dailyCheckoffs.delete(id);
  };

  const goToPrevDay = () => {
    setDateStr(format(subDays(new Date(dateStr + 'T12:00:00'), 1), 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const next = format(addDays(new Date(dateStr + 'T12:00:00'), 1), 'yyyy-MM-dd');
    if (next <= todayISO()) {
      setDateStr(next);
    }
  };

  const goToToday = () => setDateStr(todayISO());

  return {
    tasks,
    checkoffs,
    adHocCheckoffs,
    completedIds,
    completionRate,
    dateStr,
    isToday,
    toggleTask,
    updateCheckoff,
    addAdHocCheckoff,
    deleteAdHoc,
    goToPrevDay,
    goToNextDay,
    goToToday,
  };
}

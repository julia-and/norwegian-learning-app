'use client';

import { useReducer, useEffect, useCallback } from 'react';
import { db, type TimerCategory } from '@/lib/db';
import { todayISO } from '@/lib/utils';

type TimerState =
  | { status: 'idle'; category: TimerCategory; elapsed: number }
  | { status: 'running'; category: TimerCategory; startTime: number; elapsed: number }
  | { status: 'paused'; category: TimerCategory; elapsed: number };

type TimerAction =
  | { type: 'start' }
  | { type: 'tick' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'stop' }
  | { type: 'reset' }
  | { type: 'setCategory'; category: TimerCategory };

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'start':
      return {
        status: 'running',
        category: state.category,
        startTime: Date.now(),
        elapsed: 0,
      };
    case 'tick':
      if (state.status !== 'running') return state;
      return {
        ...state,
        elapsed: Math.floor((Date.now() - state.startTime) / 1000),
      };
    case 'pause':
      if (state.status !== 'running') return state;
      return {
        status: 'paused',
        category: state.category,
        elapsed: state.elapsed,
      };
    case 'resume':
      if (state.status !== 'paused') return state;
      return {
        status: 'running',
        category: state.category,
        startTime: Date.now() - state.elapsed * 1000,
        elapsed: state.elapsed,
      };
    case 'stop':
    case 'reset':
      return { status: 'idle', category: state.category, elapsed: 0 };
    case 'setCategory':
      if (state.status !== 'idle') return state;
      return { ...state, category: action.category };
    default:
      return state;
  }
}

export function useTimer() {
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    category: 'reading' as TimerCategory,
    elapsed: 0,
  });

  useEffect(() => {
    if (state.status !== 'running') return;
    const interval = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(interval);
  }, [state.status]);

  const start = useCallback(() => dispatch({ type: 'start' }), []);
  const pause = useCallback(() => dispatch({ type: 'pause' }), []);
  const resume = useCallback(() => dispatch({ type: 'resume' }), []);
  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const setCategory = useCallback((category: TimerCategory) => {
    dispatch({ type: 'setCategory', category });
  }, []);

  const stop = useCallback(async () => {
    if (state.status === 'idle' || state.elapsed < 1) {
      dispatch({ type: 'reset' });
      return null;
    }

    const session = {
      id: crypto.randomUUID(),
      category: state.category,
      date: todayISO(),
      durationSeconds: state.elapsed,
      startedAt: new Date(Date.now() - state.elapsed * 1000),
      endedAt: new Date(),
    };

    await db.timerSessions.add(session);
    dispatch({ type: 'stop' });
    return session;
  }, [state]);

  return {
    status: state.status,
    category: state.category,
    elapsed: state.elapsed,
    start,
    pause,
    resume,
    stop,
    reset,
    setCategory,
  };
}

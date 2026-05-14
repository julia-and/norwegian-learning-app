'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncAction<Args extends unknown[], R> {
  /** Invoke the action. Resolves to R or null if it threw (error is captured). */
  run: (...args: Args) => Promise<R | null>;
  error: string | null;
  isPending: boolean;
  reset: () => void;
}

/**
 * Wraps an async function to track its pending/error state without forcing
 * every call site to write its own try/catch + spinner state.
 *
 * The returned `run` is stable across renders (the wrapped fn is read via
 * ref) so it is safe to pass to useEffect dep arrays or memoized children.
 */
export function useAsyncAction<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
): AsyncAction<Args, R> {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const mounted = useRef(true);

  const run = useCallback(async (...args: Args): Promise<R | null> => {
    setPending(true);
    setError(null);
    try {
      const result = await fnRef.current(...args);
      if (mounted.current) setPending(false);
      return result;
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err.message : String(err));
        setPending(false);
      }
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setPending(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  return { run, error, isPending, reset };
}

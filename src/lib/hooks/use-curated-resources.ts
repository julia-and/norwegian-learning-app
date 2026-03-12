'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import {
  fetchCuratedResources,
  getRandomResource,
  type CuratedResource,
  type ResourceType,
  type CEFRLevel,
} from '@/lib/resources';

export function useCuratedResources() {
  const [resources, setResources] = useState<CuratedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const consumedRecords = useLiveQuery(
    () => db.consumedResources.toArray()
  ) ?? [];

  const consumedIds = new Set(consumedRecords.map(r => r.id));

  useEffect(() => {
    fetchCuratedResources()
      .then(setResources)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const markConsumed = useCallback(async (resourceId: string) => {
    const existing = await db.consumedResources.get(resourceId);
    if (!existing) {
      await db.consumedResources.add({
        id: resourceId,
        consumedAt: new Date(),
      });
    }
  }, []);

  const pickRandom = useCallback((
    type: ResourceType | 'all',
    level: CEFRLevel | 'all',
  ): CuratedResource | null => {
    return getRandomResource(resources, type, level, consumedIds);
  }, [resources, consumedIds]);

  const filterResources = useCallback((
    type: ResourceType | 'all',
    level: CEFRLevel | 'all',
  ): CuratedResource[] => {
    return resources.filter(r => {
      if (type !== 'all' && r.contentType !== type && r.contentType !== 'both') return false;
      if (level !== 'all' && !r.cefrLevels.includes(level)) return false;
      return true;
    });
  }, [resources]);

  return {
    resources,
    loading,
    error,
    consumedIds,
    markConsumed,
    pickRandom,
    filterResources,
  };
}

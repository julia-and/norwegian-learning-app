'use client';

import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { loadWordChoiceGroups } from '@/lib/word-choices';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import type { CEFRLevel } from '@/lib/resources';
import type { WordChoiceCategory, WordChoiceGroup } from '@/lib/word-choices';

export function useWordChoices() {
  const [preferredLevel] = usePreferredLevel();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>(preferredLevel);
  const [categoryFilter, setCategoryFilter] = useState<WordChoiceCategory | 'all'>('all');
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [allGroups, setAllGroups] = useState<WordChoiceGroup[]>([]);

  useEffect(() => { loadWordChoiceGroups().then(setAllGroups); }, []);

  useEffect(() => {
    setExpandedGroupId(null);
  }, [levelFilter, categoryFilter]);

  const filteredGroups: WordChoiceGroup[] = useMemo(() => {
    let base: WordChoiceGroup[] = allGroups;
    if (levelFilter !== 'all') base = base.filter(g => g.level === levelFilter);
    if (categoryFilter !== 'all') base = base.filter(g => g.category === categoryFilter);
    return base;
  }, [allGroups, levelFilter, categoryFilter]);

  const fuse = useMemo(
    () => new Fuse(filteredGroups, {
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'tags', weight: 0.25 },
        { name: 'words.word', weight: 0.2 },
        { name: 'words.meaning', weight: 0.1 },
        { name: 'words.meaningEnglish', weight: 0.1 },
        { name: 'tip', weight: 0.05 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
    }),
    [filteredGroups],
  );

  const groups: WordChoiceGroup[] = useMemo(() => {
    if (!search.trim()) return filteredGroups;
    return fuse.search(search).map(r => r.item);
  }, [search, fuse, filteredGroups]);

  return {
    groups,
    search,
    setSearch,
    levelFilter,
    setLevelFilter,
    categoryFilter,
    setCategoryFilter,
    expandedGroupId,
    setExpandedGroupId,
  };
}

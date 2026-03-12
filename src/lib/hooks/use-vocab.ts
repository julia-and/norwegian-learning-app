'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { db, type ReviewStatus, type VocabEntry } from '@/lib/db';

export function useVocab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');

  const allEntries = useLiveQuery(
    () => db.vocabEntries.orderBy('createdAt').reverse().toArray(),
    []
  ) ?? [];

  const entries = allEntries.filter(entry => {
    if (statusFilter !== 'all' && entry.reviewStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        entry.norwegian.toLowerCase().includes(q) ||
        entry.english.toLowerCase().includes(q) ||
        (entry.notes?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const addEntry = async (data: {
    norwegian: string;
    english: string;
    notes?: string;
    category?: string;
  }) => {
    const now = new Date();
    await db.vocabEntries.add({
      id: crypto.randomUUID(),
      ...data,
      reviewStatus: 'new',
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateEntry = async (id: string, data: Partial<VocabEntry>) => {
    await db.vocabEntries.update(id, { ...data, updatedAt: new Date() });
  };

  const deleteEntry = async (id: string) => {
    await db.vocabEntries.delete(id);
  };

  const setStatus = async (id: string, status: ReviewStatus) => {
    await db.vocabEntries.update(id, { reviewStatus: status, updatedAt: new Date() });
  };

  const categories = [...new Set(allEntries.map(e => e.category).filter(Boolean))] as string[];

  const counts = {
    total: allEntries.length,
    new: allEntries.filter(e => e.reviewStatus === 'new').length,
    learning: allEntries.filter(e => e.reviewStatus === 'learning').length,
    known: allEntries.filter(e => e.reviewStatus === 'known').length,
  };

  return {
    entries,
    allEntries,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    addEntry,
    updateEntry,
    deleteEntry,
    setStatus,
    categories,
    counts,
  };
}

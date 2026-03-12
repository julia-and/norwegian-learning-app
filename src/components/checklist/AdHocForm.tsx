'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { Category } from '@/lib/db';
import styles from './ad-hoc-form.module.css';

interface AdHocFormProps {
  onSave: (label: string, category: Category, durationMinutes?: number) => void;
  onCancel: () => void;
}

const CATEGORIES = Object.entries(CATEGORY_CONFIG) as [Category, (typeof CATEGORY_CONFIG)[Category]][];

export function AdHocForm({ onSave, onCancel }: AdHocFormProps) {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<Category>('reading');
  const [duration, setDuration] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const durationMinutes = duration ? parseInt(duration, 10) : undefined;
    onSave(trimmed, category, durationMinutes || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className={styles.form}>
      <input
        ref={inputRef}
        className={styles.labelInput}
        value={label}
        onChange={e => setLabel(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Øvelsesnavn..."
      />
      <select
        className={styles.categorySelect}
        value={category}
        onChange={e => setCategory(e.target.value as Category)}
      >
        {CATEGORIES.map(([key, cfg]) => (
          <option key={key} value={key}>{cfg.emoji} {cfg.label}</option>
        ))}
      </select>
      <input
        className={styles.durationInput}
        type="number"
        min="1"
        max="600"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="min"
      />
      <button className={styles.saveBtn} onClick={handleSave} title="Lagre" disabled={!label.trim()}>
        <Check size={14} />
      </button>
      <button className={styles.cancelBtn} onClick={onCancel} title="Avbryt">
        <X size={14} />
      </button>
    </div>
  );
}

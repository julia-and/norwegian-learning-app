'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { DailyCheckoff } from '@/lib/db';
import styles from './checkoff-edit-modal.module.css';

interface CheckoffEditModalProps {
  checkoff: DailyCheckoff | null;
  onSave: (completedAt: Date, durationMinutes?: number, notes?: string) => void;
  onClose: () => void;
}

export function CheckoffEditModal({ checkoff, onSave, onClose }: CheckoffEditModalProps) {
  const [time, setTime] = useState(() =>
    checkoff ? format(checkoff.completedAt, 'HH:mm') : ''
  );
  const [duration, setDuration] = useState(() =>
    checkoff?.durationMinutes != null ? String(checkoff.durationMinutes) : ''
  );
  const [notes, setNotes] = useState(() => checkoff?.notes ?? '');

  if (!checkoff) return null;

  const handleSave = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const completedAt = new Date(`${checkoff.date}T${time}:00`);
    if (isNaN(completedAt.getTime()) || isNaN(hours) || isNaN(minutes)) return;
    const durationMinutes = duration ? parseInt(duration, 10) : undefined;
    onSave(completedAt, durationMinutes || undefined, notes.trim() || undefined);
  };

  return (
    <Dialog
      open={!!checkoff}
      onClose={onClose}
      title="Rediger registrering"
      footer={
        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose}>Avbryt</Button>
          <Button onClick={handleSave}>Lagre</Button>
        </div>
      }
    >
      <div className={styles.fields}>
        <Input
          label="Tidspunkt"
          type="time"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
        <Input
          label="Varighet (min, valgfritt)"
          type="number"
          min="1"
          max="600"
          value={duration}
          onChange={e => setDuration(e.target.value)}
          placeholder="f.eks. 30"
        />
        <div className={styles.notesField}>
          <label className={styles.notesLabel}>Notater (valgfritt)</label>
          <textarea
            className={styles.notesTextarea}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="f.eks. Leste kapittel 3, øvde på verb..."
            rows={3}
          />
        </div>
      </div>
    </Dialog>
  );
}

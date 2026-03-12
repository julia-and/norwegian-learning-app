'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { ChecklistItem } from './ChecklistItem';
import { AdHocItem } from './AdHocItem';
import { AdHocForm } from './AdHocForm';
import { CheckoffEditModal } from './CheckoffEditModal';
import { DateNavigator } from './DateNavigator';
import { useChecklist } from '@/lib/hooks/use-checklist';
import type { DailyCheckoff } from '@/lib/db';

export function DailyChecklist() {
  const {
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
  } = useChecklist();

  const [editingCheckoff, setEditingCheckoff] = useState<DailyCheckoff | null>(null);
  const [showAdHocForm, setShowAdHocForm] = useState(false);

  const completedCount = completedIds.size;
  const totalCount = tasks.length;

  return (
    <Card>
      <CardHeader
        title="Daglig øvelse"
        subtitle={totalCount > 0 ? `${completedCount}/${totalCount} fullført` : undefined}
        action={
          <DateNavigator
            dateStr={dateStr}
            onPrev={goToPrevDay}
            onNext={goToNextDay}
            onToday={goToToday}
          />
        }
      />

      {totalCount === 0 ? (
        <p className="text-secondary text-sm" style={{ padding: 'var(--space-4) 0' }}>
          Ingen oppgaver ennå. Legg til i Innstillinger. ⚙️
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {tasks.map(task => {
            const checkoff = checkoffs.find(c => c.taskId === task.id);
            return (
              <ChecklistItem
                key={task.id}
                task={task}
                checkoff={checkoff}
                onToggle={() => toggleTask(task.id)}
                onEditCheckoff={setEditingCheckoff}
              />
            );
          })}

          {adHocCheckoffs.map(checkoff => (
            <AdHocItem
              key={checkoff.id}
              checkoff={checkoff}
              onDelete={deleteAdHoc}
            />
          ))}
        </div>
      )}

      {showAdHocForm ? (
        <AdHocForm
          onSave={(label, category, durationMinutes) => {
            addAdHocCheckoff(label, category, durationMinutes);
            setShowAdHocForm(false);
          }}
          onCancel={() => setShowAdHocForm(false)}
        />
      ) : (
        <button
          className="text-secondary text-sm"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            marginTop: 'var(--space-2)',
            padding: 'var(--space-1) 0',
            fontFamily: 'inherit',
            color: 'var(--color-text-tertiary)',
          }}
          onClick={() => setShowAdHocForm(true)}
        >
          <Plus size={14} /> Legg til øvelse
        </button>
      )}

      {completionRate === 1 && isToday && (
        <div className="text-center text-success font-medium" style={{ marginTop: 'var(--space-4)' }}>
          Alt ferdig for i dag! Bra jobba! 🎉
        </div>
      )}

      <CheckoffEditModal
        checkoff={editingCheckoff}
        onSave={(completedAt, durationMinutes, notes) => {
          if (editingCheckoff) updateCheckoff(editingCheckoff.id, completedAt, durationMinutes, notes);
          setEditingCheckoff(null);
        }}
        onClose={() => setEditingCheckoff(null)}
      />
    </Card>
  );
}

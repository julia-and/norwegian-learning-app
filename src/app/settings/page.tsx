'use client';

import { useState } from 'react';
import { useLiveQuery, useObservable } from 'dexie-react-hooks';
import { Download, Upload, Trash2, Plus, FileArchive } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Select } from '@/components/ui/Select';
import { ApkgImportDialog } from '@/components/anki/ApkgImportDialog';
import { AnkiConnectSettings } from '@/components/anki/AnkiConnectSettings';
import { SyncSettings } from '@/components/sync/SyncSettings';
import { DayPicker } from '@/components/settings/DayPicker';
import { db, type Category } from '@/lib/db';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { useTheme } from '@/components/layout/ThemeProvider';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import type { CEFRLevel } from '@/lib/resources';
import { Sun, Moon } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [preferredLevel, setPreferredLevel] = usePreferredLevel();
  const tasks = useLiveQuery(() => db.practiceTasks.orderBy('order').toArray()) ?? [];
  const currentUser = useObservable(db.cloud.currentUser);
  const [addOpen, setAddOpen] = useState(false);
  const [apkgOpen, setApkgOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('reading');

  const addTask = async () => {
    if (!newName.trim()) return;
    await db.practiceTasks.add({
      id: crypto.randomUUID(),
      name: newName.trim(),
      category: newCategory,
      order: tasks.length,
      isActive: 1,
      activeDays: 127,
      createdAt: new Date(),
    });
    setNewName('');
    setAddOpen(false);
  };

  const toggleTaskActive = async (id: string, current: number) => {
    await db.practiceTasks.update(id, { isActive: current === 1 ? 0 : 1 });
  };

  const updateTaskDays = async (id: string, activeDays: number) => {
    await db.practiceTasks.update(id, { activeDays });
  };

  const deleteTask = async (id: string) => {
    await db.practiceTasks.delete(id);
    await db.dailyCheckoffs.where('taskId').equals(id).delete();
  };

  const exportData = async () => {
    const data = {
      practiceTasks: await db.practiceTasks.toArray(),
      dailyCheckoffs: await db.dailyCheckoffs.toArray(),
      vocabEntries: await db.vocabEntries.toArray(),
      timerSessions: await db.timerSessions.toArray(),
      writingSubmissions: await db.writingSubmissions.toArray(),
      consumedResources: await db.consumedResources.toArray(),
      difficultyRatings: await db.difficultyRatings.toArray(),
      grammarProgress: await db.grammarProgress.toArray(),
      conversationSessions: await db.conversationSessions.toArray(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `norsk-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;
      try {
        data = JSON.parse(await file.text());
      } catch {
        alert('Import mislyktes: ugyldig JSON-fil. Ingen data ble endret.');
        return;
      }

      try {
        await db.transaction('rw', [
          db.practiceTasks, db.dailyCheckoffs, db.vocabEntries,
          db.timerSessions, db.writingSubmissions, db.consumedResources,
          db.difficultyRatings, db.grammarProgress, db.conversationSessions,
        ], async () => {
          if (data.practiceTasks) {
            await db.practiceTasks.clear();
            await db.practiceTasks.bulkAdd(data.practiceTasks.map((t: Record<string, unknown>) => ({
              ...t,
              activeDays: typeof t.activeDays === 'number' ? t.activeDays : 127,
              createdAt: new Date(t.createdAt as string),
            })));
          }
          if (data.dailyCheckoffs) {
            await db.dailyCheckoffs.clear();
            await db.dailyCheckoffs.bulkAdd(data.dailyCheckoffs.map((c: Record<string, unknown>) => ({
              ...c,
              completedAt: new Date(c.completedAt as string),
            })));
          }
          if (data.vocabEntries) {
            await db.vocabEntries.clear();
            await db.vocabEntries.bulkAdd(data.vocabEntries.map((v: Record<string, unknown>) => ({
              ...v,
              createdAt: new Date(v.createdAt as string),
              updatedAt: new Date(v.updatedAt as string),
            })));
          }
          if (data.timerSessions) {
            await db.timerSessions.clear();
            await db.timerSessions.bulkAdd(data.timerSessions.map((s: Record<string, unknown>) => ({
              ...s,
              startedAt: new Date(s.startedAt as string),
              endedAt: new Date(s.endedAt as string),
            })));
          }
          if (data.writingSubmissions) {
            await db.writingSubmissions.clear();
            await db.writingSubmissions.bulkAdd(data.writingSubmissions.map((s: Record<string, unknown>) => ({
              ...s,
              createdAt: new Date(s.createdAt as string),
            })));
          }
          if (data.consumedResources) {
            await db.consumedResources.clear();
            await db.consumedResources.bulkAdd(data.consumedResources.map((r: Record<string, unknown>) => ({
              ...r,
              consumedAt: new Date(r.consumedAt as string),
            })));
          }
          if (data.difficultyRatings) {
            await db.difficultyRatings.clear();
            await db.difficultyRatings.bulkAdd(data.difficultyRatings.map((r: Record<string, unknown>) => ({
              ...r,
              ratedAt: new Date(r.ratedAt as string),
            })));
          }
          if (data.grammarProgress) {
            await db.grammarProgress.clear();
            await db.grammarProgress.bulkPut(data.grammarProgress.map((r: Record<string, unknown>) => ({
              ...r,
              updatedAt: new Date(r.updatedAt as string),
            })));
          }
          if (data.conversationSessions) {
            await db.conversationSessions.clear();
            await db.conversationSessions.bulkAdd(data.conversationSessions.map((s: Record<string, unknown>) => ({
              ...s,
              createdAt: new Date(s.createdAt as string),
              completedAt: s.completedAt ? new Date(s.completedAt as string) : undefined,
            })));
          }
        });
        alert('Data importert!');
      } catch (err) {
        alert(`Import mislyktes: ${err instanceof Error ? err.message : String(err)}. Ingen data ble endret.`);
      }
    };
    input.click();
  };

  const clearAllData = async () => {
    const isLoggedIn = currentUser?.isLoggedIn ?? false;
    const msg = isLoggedIn
      ? 'Slette all lokal data? Skysikkerhetskopi gjenopprettes ved neste synkronisering.'
      : '⚠️ Du er IKKE pålogget skysynkronisering. All data slettes permanent uten gjenoppretting. Er du helt sikker?';
    if (!confirm(msg)) return;
    if (!isLoggedIn && !confirm('Siste sjanse — dette kan ikke angres. Bekreft?')) return;
    await db.delete();
    window.location.reload();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Innstillinger</h1>

      <SyncSettings />

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Utseende</h2>
          <Button variant="secondary" onClick={toggle} size="md">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Lys modus' : 'Mørk modus'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Foretrukket nivå</h2>
          <p className={styles.sectionDesc}>Standardnivå for Ressurser og Skriving</p>
          <div className={styles.levelPicker}>
            {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map(lvl => (
              <button
                key={lvl}
                className={`${styles.levelBtn} ${preferredLevel === lvl ? styles.levelBtnActive : ''}`}
                onClick={() => setPreferredLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={styles.sectionTitle}>Øvingsoppgaver</h2>
              <p className={styles.sectionDesc}>Daglige øvingsaktiviteter</p>
            </div>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={14} /> Legg til
            </Button>
          </div>

          <div className={styles.taskList}>
            {tasks.map(task => {
              const config = CATEGORY_CONFIG[task.category];
              return (
                <div key={task.id} className={styles.taskItem}>
                  <div className={styles.taskRow}>
                    <div className={styles.taskInfo}>
                      <span>{config.emoji}</span>
                      <span className="font-medium">{task.name}</span>
                      <Badge variant={task.category}>
                        {config.label}
                      </Badge>
                      {!task.isActive && <Badge variant="default">Skjult</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTaskActive(task.id, task.isActive)}
                      >
                        {task.isActive ? 'Skjul' : 'Vis'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={() => deleteTask(task.id)}
                        aria-label="Slett oppgave"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <DayPicker
                    activeDays={task.activeDays ?? 127}
                    onChange={(days) => updateTaskDays(task.id, days)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data</h2>
          <p className={styles.sectionDesc}>Eksporter eller importer læringsdata som JSON</p>
          <div className={styles.exportSection}>
            <Button variant="secondary" onClick={exportData} size="md">
              <Download size={16} /> Eksporter
            </Button>
            <Button variant="secondary" onClick={importData} size="md">
              <Upload size={16} /> Importer
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Anki-import</h2>
          <p className={styles.sectionDesc}>Importer ordforråd fra en Anki-fil (.apkg)</p>
          <Button variant="secondary" onClick={() => setApkgOpen(true)} size="md">
            <FileArchive size={16} /> Importer .apkg
          </Button>
        </div>
      </Card>

      <AnkiConnectSettings />

      <Card>
        <div className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Faresone ⚠️</h2>
          <p className={styles.sectionDesc} style={{ marginBottom: 'var(--space-3)' }}>
            Slett all data permanent. Dette kan ikke angres.
          </p>
          <Button variant="danger" onClick={clearAllData} size="md">
            <Trash2 size={16} /> Slett alle data
          </Button>
        </div>
      </Card>

      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Ny øvingsoppgave"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Avbryt</Button>
            <Button onClick={addTask}>Legg til</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Oppgavenavn"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="f.eks. Grammatikkøvelser"
            autoFocus
          />
          <Select
            label="Kategori"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value as Category)}
            options={[
              { value: 'reading', label: 'Lesing' },
              { value: 'writing', label: 'Skriving' },
              { value: 'listening', label: 'Lytting' },
              { value: 'speaking', label: 'Snakking' },
              { value: 'vocabulary', label: 'Ordforråd' },
            ]}
          />
        </div>
      </Dialog>

      <ApkgImportDialog open={apkgOpen} onClose={() => setApkgOpen(false)} />
    </div>
  );
}

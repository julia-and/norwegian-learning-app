import Dexie, { type EntityTable } from 'dexie';
import dexieCloud from 'dexie-cloud-addon';
import type { CorrectionResult } from '@/lib/claude';
import type { ResourceType } from '@/lib/resources';
import type { ChatMessage } from '@/lib/converse';

export type Category = 'reading' | 'writing' | 'listening' | 'speaking' | 'vocabulary';
export type TimerCategory = Category;
export type ReviewStatus = 'new' | 'learning' | 'known';

export interface PracticeTask {
  id: string;
  name: string;
  category: Category;
  order: number;
  isActive: number; // 1 or 0 — IndexedDB doesn't index booleans
  activeDays: number; // bitmask: bit 0=Sun, bit 1=Mon, …, bit 6=Sat. 127 = every day
  createdAt: Date;
}

export interface DailyCheckoff {
  id: string;
  taskId: string;
  date: string; // ISO date "2026-03-01"
  completedAt: Date;
  durationMinutes?: number;
  notes?: string;
  // Ad-hoc fields — only set when taskId === 'adhoc'
  label?: string;
  adHocCategory?: Category;
}

export interface VocabEntry {
  id: string;
  norwegian: string;
  english: string;
  notes?: string;
  category?: string;
  reviewStatus: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerSession {
  id: string;
  category: TimerCategory;
  date: string; // ISO date
  durationSeconds: number;
  startedAt: Date;
  endedAt: Date;
}

export interface SelfCorrectionAttempt {
  original: string;
  userAttempt: string;
  correct: string;
  wasCorrect: boolean;
  skipped: boolean;
}

export interface WritingSubmission {
  id: string;
  date: string;
  promptId: string | null;
  promptText: string;
  level: string;
  originalText: string;
  wordCount: number;
  correctionResult: CorrectionResult;
  fluencyRating: number;
  selfCorrections: SelfCorrectionAttempt[];
  createdAt: Date;
}

export interface ConsumedResource {
  id: string;
  consumedAt: Date;
}

export interface DifficultyRating {
  id: string;
  sessionId: string;       // FK → timerSessions.id
  contentType: ResourceType; // 'listening' | 'reading' | 'both'
  rating: number;          // 1 = very easy … 5 = very hard
  date: string;            // ISO date
  ratedAt: Date;
}

export interface GrammarProgress {
  ruleId: string;
  status?: 'learning' | 'known';
  updatedAt: Date;
  userNotes?: string;
}

export interface PrepositionSession {
  id: string;
  date: string;
  level: string;
  score: number;
  results: { exerciseId: string; userAnswer: string; correct: boolean }[];
  completedAt: Date;
}

export interface ConversationSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  level: string;
  messages: ChatMessage[];
  turnCount: number;
  timerSessionId?: string;
  correctionResult?: CorrectionResult;
  createdAt: Date;
  completedAt?: Date;
}

class TrackerDB extends Dexie {
  practiceTasks!: EntityTable<PracticeTask, 'id'>;
  dailyCheckoffs!: EntityTable<DailyCheckoff, 'id'>;
  vocabEntries!: EntityTable<VocabEntry, 'id'>;
  timerSessions!: EntityTable<TimerSession, 'id'>;
  writingSubmissions!: EntityTable<WritingSubmission, 'id'>;
  consumedResources!: EntityTable<ConsumedResource, 'id'>;
  difficultyRatings!: EntityTable<DifficultyRating, 'id'>;
  grammarProgress!: EntityTable<GrammarProgress, 'ruleId'>;
  conversationSessions!: EntityTable<ConversationSession, 'id'>;
  prepositionSessions!: EntityTable<PrepositionSession, 'id'>;

  constructor() {
    super('norsk-tracker', { addons: [dexieCloud] });

    this.version(1).stores({
      practiceTasks: 'id, category, order, isActive',
      dailyCheckoffs: 'id, taskId, date, [taskId+date]',
      vocabEntries: 'id, norwegian, reviewStatus, category, createdAt',
      timerSessions: 'id, category, date',
    });

    this.version(2).stores({
      practiceTasks: 'id, category, order, isActive',
      dailyCheckoffs: 'id, taskId, date, [taskId+date]',
      vocabEntries: 'id, norwegian, reviewStatus, category, createdAt',
      timerSessions: 'id, category, date',
      writingSubmissions: 'id, date, level, fluencyRating, createdAt',
    });

    this.version(3).stores({
      practiceTasks: 'id, category, order, isActive',
      dailyCheckoffs: 'id, taskId, date, [taskId+date]',
      vocabEntries: 'id, norwegian, reviewStatus, category, createdAt',
      timerSessions: 'id, category, date',
      writingSubmissions: 'id, date, level, fluencyRating, createdAt',
      consumedResources: 'id, consumedAt',
    });

    this.version(4).stores({
      practiceTasks: 'id, category, order, isActive',
      dailyCheckoffs: 'id, taskId, date, [taskId+date]',
      vocabEntries: 'id, norwegian, reviewStatus, category, createdAt',
      timerSessions: 'id, category, date',
      writingSubmissions: 'id, date, level, fluencyRating, createdAt',
      consumedResources: 'id, consumedAt',
    }).upgrade(async tx => {
      await tx.table('practiceTasks').toCollection().modify((task: PracticeTask) => {
        if (task.activeDays === undefined) task.activeDays = 127;
      });
    });

    this.version(5).stores({
      practiceTasks:      'id, category, order, isActive',
      dailyCheckoffs:     'id, taskId, date, [taskId+date]',
      vocabEntries:       'id, norwegian, reviewStatus, category, createdAt',
      timerSessions:      'id, category, date',
      writingSubmissions: 'id, date, level, fluencyRating, createdAt',
      consumedResources:  'id, consumedAt',
      difficultyRatings:  'id, sessionId, contentType, date, ratedAt',
    });

    this.version(6).stores({
      practiceTasks:      'id, category, order, isActive',
      dailyCheckoffs:     'id, taskId, date, [taskId+date]',
      vocabEntries:       'id, norwegian, reviewStatus, category, createdAt',
      timerSessions:      'id, category, date',
      writingSubmissions: 'id, date, level, fluencyRating, createdAt',
      consumedResources:  'id, consumedAt',
      difficultyRatings:  'id, sessionId, contentType, date, ratedAt',
      grammarProgress:    '&ruleId, status, updatedAt',
    });

    this.version(7).stores({
      practiceTasks:      'id, category, order, isActive',
      dailyCheckoffs:     'id, taskId, date, [taskId+date]',
      vocabEntries:       'id, norwegian, reviewStatus, category, createdAt',
      timerSessions:      'id, category, date',
      writingSubmissions: 'id, date, level, fluencyRating, createdAt',
      consumedResources:  'id, consumedAt',
      difficultyRatings:  'id, sessionId, contentType, date, ratedAt',
      grammarProgress:    '&ruleId, status, updatedAt',
    });

    this.version(8).stores({
      practiceTasks:        'id, category, order, isActive',
      dailyCheckoffs:       'id, taskId, date, [taskId+date]',
      vocabEntries:         'id, norwegian, reviewStatus, category, createdAt',
      timerSessions:        'id, category, date',
      writingSubmissions:   'id, date, level, fluencyRating, createdAt',
      consumedResources:    'id, consumedAt',
      difficultyRatings:    'id, sessionId, contentType, date, ratedAt',
      grammarProgress:      '&ruleId, status, updatedAt',
      conversationSessions: 'id, level, scenarioId, completedAt, createdAt',
    });

    this.version(9).stores({
      practiceTasks:        'id, category, order, isActive',
      dailyCheckoffs:       'id, taskId, date, [taskId+date]',
      vocabEntries:         'id, norwegian, reviewStatus, category, createdAt',
      timerSessions:        'id, category, date',
      writingSubmissions:   'id, date, level, fluencyRating, createdAt',
      consumedResources:    'id, consumedAt',
      difficultyRatings:    'id, sessionId, contentType, date, ratedAt',
      grammarProgress:      '&ruleId, status, updatedAt',
      conversationSessions: 'id, level, scenarioId, completedAt, createdAt',
      prepositionSessions:  'id, date, level, completedAt',
    });
  }
}

export const db = new TrackerDB();

db.cloud.configure({
  databaseUrl: 'https://zqrybn9ex.dexie.cloud',
  requireAuth: false,
});

async function waitForSyncToSettle(): Promise<void> {
  return new Promise((resolve) => {
    const subscription = db.cloud.syncState.subscribe(({ phase }) => {
      if (phase !== 'not-in-sync' && phase !== 'pushing' && phase !== 'pulling') {
        subscription.unsubscribe();
        resolve();
      }
    });
  });
}

export async function seedDefaults() {
  const count = await db.practiceTasks.count();
  if (count > 0) return;

  // Wait for cloud sync to settle before seeding to avoid duplicating cloud data
  // on a new device. Falls back after 5s for offline/error scenarios.
  await Promise.race([
    waitForSyncToSettle(),
    new Promise<void>(resolve => setTimeout(resolve, 5000)),
  ]);

  const countAfterSync = await db.practiceTasks.count();
  if (countAfterSync > 0) return;

  const defaults: { name: string; category: Category }[] = [
    { name: 'Reading', category: 'reading' },
    { name: 'Writing', category: 'writing' },
    { name: 'Listening', category: 'listening' },
    { name: 'Speaking', category: 'speaking' },
    { name: 'Vocabulary', category: 'vocabulary' },
  ];

  await db.practiceTasks.bulkAdd(
    defaults.map((d, i) => ({
      id: crypto.randomUUID(),
      name: d.name,
      category: d.category,
      order: i,
      isActive: 1,
      activeDays: 127,
      createdAt: new Date(),
    }))
  );
}

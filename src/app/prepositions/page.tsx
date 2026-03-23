'use client';

import { useState, useRef } from 'react';
import { CheckCircle2, XCircle, RefreshCw, BookOpen, PenLine, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import { PREP_GUIDE, PREP_EXERCISES, sampleExercises } from '@/lib/prepositions';
import type { PrepGuideEntry, PrepExercise } from '@/lib/prepositions';
import type { CEFRLevel } from '@/lib/resources';
import { db } from '@/lib/db';
import styles from './page.module.css';

type Phase = 'guide' | 'quiz' | 'results';
const LEVELS: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2'];

// ── Guide ─────────────────────────────────────────────────────────────────────

function GuideCard({ entry }: { entry: PrepGuideEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.guideCard}>
      <button className={styles.guideCardHeader} onClick={() => setOpen(v => !v)}>
        <span className={styles.guideWord}>{entry.word}</span>
        <span className={styles.guideLevel}>{entry.level}</span>
        <span className={styles.guideExcerpt}>{entry.explanationEnglish.slice(0, 60)}…</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className={styles.guideCardBody}>
          <p className={styles.guideExplanationNorsk}>{entry.explanationNorsk}</p>
          <p className={styles.guideExplanationEn}>{entry.explanationEnglish}</p>

          <div className={styles.exampleList}>
            {entry.examples.map((ex, i) => (
              <div key={i} className={styles.exampleRow}>
                <span className={styles.exampleNo}>{ex.norwegian}</span>
                <span className={styles.exampleEn}>{ex.english}</span>
              </div>
            ))}
          </div>

          {entry.exceptions && entry.exceptions.length > 0 && (
            <div className={styles.exceptionBlock}>
              <div className={styles.exceptionTitle}>Unntak / Fixed expressions</div>
              {entry.exceptions.map((exc, i) => (
                <div key={i} className={styles.exceptionRow}>
                  <span className={styles.exceptionNo}>{exc.norwegian}</span>
                  <span className={styles.exceptionEn}>{exc.english}</span>
                  <span className={styles.exceptionNote}>{exc.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────────────────────

interface ResultItem {
  exercise: PrepExercise;
  userAnswer: string;
  correct: boolean;
}

function ResultRow({ item }: { item: ResultItem }) {
  const [showEn, setShowEn] = useState(false);
  return (
    <div className={`${styles.resultRow} ${item.correct ? styles.resultCorrect : styles.resultWrong}`}>
      <div className={styles.resultHeader}>
        {item.correct
          ? <CheckCircle2 size={16} className={styles.iconCorrect} />
          : <XCircle size={16} className={styles.iconWrong} />}
        <span className={styles.resultSentence}>
          {item.exercise.sentence.replace('___', `[${item.correct ? item.userAnswer : item.exercise.answer}]`)}
        </span>
      </div>

      {!item.correct && (
        <div className={styles.resultFeedback}>
          <span className={styles.yourAnswer}>Ditt svar: <em>{item.userAnswer || '(tom)'}</em></span>
          <span className={styles.correctAnswer}>Riktig: <strong>{item.exercise.answer}</strong></span>
          <p className={styles.explanationNorsk}>{item.exercise.explanationNorsk}</p>
          <button className={styles.spoilerBtn} onClick={() => setShowEn(v => !v)}>
            {showEn ? 'Skjul engelsk' : 'Vis engelsk forklaring'}
          </button>
          {showEn && <p className={styles.explanationEn}>{item.exercise.explanationEnglish}</p>}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PrepositionsPage() {
  const [preferredLevel] = usePreferredLevel();
  const [phase, setPhase] = useState<Phase>('guide');
  const [guideLevel, setGuideLevel] = useState<CEFRLevel | 'all'>('all');
  const [guideSearch, setGuideSearch] = useState('');
  const [exercises, setExercises] = useState<PrepExercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<ResultItem[]>([]);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // filtered guide entries
  const guideEntries = PREP_GUIDE.filter(e => {
    const matchLevel = guideLevel === 'all' || e.level === guideLevel;
    const q = guideSearch.toLowerCase();
    const matchSearch = !q || e.word.includes(q) || e.explanationEnglish.toLowerCase().includes(q);
    return matchLevel && matchSearch;
  });

  function startQuiz() {
    const sampled = sampleExercises(preferredLevel, 10);
    setExercises(sampled);
    setAnswers({});
    setResults([]);
    setPhase('quiz');
  }

  async function submitQuiz() {
    const items: ResultItem[] = exercises.map(ex => {
      const user = (answers[ex.id] ?? '').trim().toLowerCase();
      const correct = user === ex.answer.toLowerCase();
      return { exercise: ex, userAnswer: user, correct };
    });
    setResults(items);
    setPhase('results');

    const score = items.filter(r => r.correct).length;
    try {
      await db.prepositionSessions.add({
        id: crypto.randomUUID(),
        date: new Date().toISOString().slice(0, 10),
        level: preferredLevel,
        score,
        results: items.map(r => ({
          exerciseId: r.exercise.id,
          userAnswer: r.userAnswer,
          correct: r.correct,
        })),
        completedAt: new Date(),
      });
    } catch {
      // non-critical, swallow
    }
  }

  function retryQuiz() {
    startQuiz();
  }

  // handle Enter key to move to next input
  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = exercises[idx + 1];
      if (next) inputRefs.current[next.id]?.focus();
      else submitQuiz();
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'quiz') {
    return (
      <div className={styles.page}>
        <div className={styles.quizHeader}>
          <h1 className={styles.title}>Preposisjonsøvelse</h1>
          <span className={styles.levelBadge}>{preferredLevel}</span>
        </div>
        <p className={styles.quizHint}>Fyll inn riktig preposisjon i hvert felt, trykk Enter for å gå videre.</p>

        <div className={styles.quizList}>
          {exercises.map((ex, idx) => (
            <div key={ex.id} className={styles.quizItem}>
              <span className={styles.quizNum}>{idx + 1}.</span>
              <span className={styles.quizSentencePart}>
                {ex.sentence.split('___').map((part, pi, arr) => (
                  <span key={pi}>
                    {part}
                    {pi < arr.length - 1 && (
                      <input
                        ref={el => { inputRefs.current[ex.id] = el; }}
                        className={styles.quizInput}
                        value={answers[ex.id] ?? ''}
                        onChange={e => setAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
                        onKeyDown={ev => handleKeyDown(ev, idx)}
                        autoComplete="off"
                        spellCheck={false}
                      />
                    )}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.quizActions}>
          <button className={styles.btnSecondary} onClick={() => setPhase('guide')}>
            ← Tilbake til guide
          </button>
          <button className={styles.btnPrimary} onClick={submitQuiz}>
            Lever svar
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const score = results.filter(r => r.correct).length;
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Resultater</h1>
        <div className={styles.scoreCard}>
          <span className={styles.scoreNum}>{score}</span>
          <span className={styles.scoreDenom}>/ {results.length}</span>
          <span className={styles.scoreLabel}>
            {score === results.length ? 'Perfekt! 🎉' : score >= results.length * 0.7 ? 'Bra jobbet!' : 'Øv mer!'}
          </span>
        </div>

        <div className={styles.resultsList}>
          {results.map(item => (
            <ResultRow key={item.exercise.id} item={item} />
          ))}
        </div>

        <div className={styles.quizActions}>
          <button className={styles.btnSecondary} onClick={() => setPhase('guide')}>
            <BookOpen size={16} /> Guide
          </button>
          <button className={styles.btnPrimary} onClick={retryQuiz}>
            <RefreshCw size={16} /> Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  // guide phase (default)
  return (
    <div className={styles.page}>
      <div className={styles.guidePageHeader}>
        <h1 className={styles.title}>Preposisjoner</h1>
        <button className={styles.btnPrimary} onClick={startQuiz}>
          <PenLine size={16} /> Start øving
        </button>
      </div>

      <div className={styles.guideControls}>
        <Input
          placeholder="Søk, f.eks. «på» eller «location»…"
          value={guideSearch}
          onChange={e => setGuideSearch(e.target.value)}
        />
        <div className={styles.filterGroup}>
          {LEVELS.map(l => (
            <button
              key={l}
              className={`${styles.filterBtn} ${guideLevel === l ? styles.filterBtnActive : ''}`}
              onClick={() => setGuideLevel(l)}
            >
              {l === 'all' ? 'Alle nivåer' : l}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.guideMeta}>{guideEntries.length} preposisjoner</p>

      <div className={styles.guideList}>
        {guideEntries.length === 0
          ? <p className={styles.empty}>Ingen treff.</p>
          : guideEntries.map(entry => <GuideCard key={entry.id} entry={entry} />)
        }
      </div>

      <div className={styles.exerciseCount}>
        <span>{PREP_EXERCISES.length} øvingssetninger tilgjengelig</span>
        <button className={styles.btnPrimary} onClick={startQuiz}>
          <PenLine size={16} /> Start øving ({preferredLevel})
        </button>
      </div>
    </div>
  );
}

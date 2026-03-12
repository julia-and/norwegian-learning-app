'use client';

import { useState, useMemo } from 'react';
import type { GrammarExercise as GrammarExerciseType } from '@/lib/grammar-rules';
import styles from './grammar-exercise.module.css';

interface GrammarExerciseProps {
  exercises: GrammarExerciseType[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = 'prompt' | 'correct' | 'incorrect';

function SingleExercise({ exercise, onNext, isLast }: {
  exercise: GrammarExerciseType;
  onNext: () => void;
  isLast: boolean;
}) {
  const [phase, setPhase] = useState<Phase>('prompt');
  const [value, setValue] = useState('');

  const shuffledOptions = useMemo(
    () => exercise.options ? shuffle(exercise.options) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.prompt]
  );

  const submit = (answer: string) => {
    const correct = answer.trim().toLowerCase() === exercise.answer.trim().toLowerCase();
    setPhase(correct ? 'correct' : 'incorrect');
  };

  const handleNext = () => {
    setPhase('prompt');
    setValue('');
    onNext();
  };

  return (
    <div className={styles.exercise}>
      <p className={styles.prompt}>{exercise.prompt}</p>
      {exercise.hint && <p className={styles.hint}>{exercise.hint}</p>}

      {phase === 'prompt' && exercise.type === 'fill-in-the-blank' && (
        <form
          className={styles.fillForm}
          onSubmit={e => { e.preventDefault(); if (value.trim()) submit(value); }}
        >
          <input
            className={styles.fillInput}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Skriv svaret ditt..."
          />
          <button type="submit" className={styles.submitBtn} disabled={!value.trim()}>
            Sjekk
          </button>
        </form>
      )}

      {phase === 'prompt' && exercise.type === 'multiple-choice' && (
        <div className={styles.options}>
          {shuffledOptions.map(opt => (
            <button
              key={opt}
              className={styles.optionBtn}
              onClick={() => submit(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {phase !== 'prompt' && (
        <div className={phase === 'correct' ? styles.correct : styles.incorrect}>
          {phase === 'correct' ? (
            <span>Riktig!</span>
          ) : (
            <span>Ikke helt riktig. Rett svar: <strong>{exercise.answer}</strong></span>
          )}
          <button className={styles.nextBtn} onClick={handleNext}>
            {isLast ? 'Ferdig!' : 'Neste'}
          </button>
        </div>
      )}
    </div>
  );
}

export function GrammarExercise({ exercises }: GrammarExerciseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className={styles.done}>
        <span>Alle oppgaver fullført!</span>
        <button
          className={styles.nextBtn}
          onClick={() => { setCurrentIndex(0); setDone(false); }}
        >
          Start på nytt
        </button>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const isLast = currentIndex === exercises.length - 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.counter}>Oppgave {currentIndex + 1} / {exercises.length}</span>
      </div>
      <SingleExercise
        key={currentIndex}
        exercise={exercise}
        isLast={isLast}
        onNext={() => {
          if (isLast) {
            setDone(true);
          } else {
            setCurrentIndex(i => i + 1);
          }
        }}
      />
    </div>
  );
}

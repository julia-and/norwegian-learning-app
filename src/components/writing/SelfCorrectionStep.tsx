'use client';

import { useState, useMemo } from 'react';
import { Check, SkipForward, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CorrectionResult } from '@/lib/claude';
import type { SelfCorrectionAttempt } from '@/lib/db';
import styles from './self-correction.module.css';

interface SelfCorrectionStepProps {
  originalText: string;
  correctionResult: CorrectionResult;
  onComplete: (attempts: SelfCorrectionAttempt[]) => void;
}

interface ErrorItem {
  sentence: string;
  original: string;
  corrected: string;
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
}

function findErrorsInSentences(text: string, correctionResult: CorrectionResult): ErrorItem[] {
  const sentences = splitSentences(text);
  const errors: ErrorItem[] = [];

  for (const correction of correctionResult.corrections) {
    const sentence = sentences.find(s => s.includes(correction.original));
    if (sentence) {
      errors.push({
        sentence,
        original: correction.original,
        corrected: correction.corrected,
      });
    }
  }

  return errors;
}

export function SelfCorrectionStep({ originalText, correctionResult, onComplete }: SelfCorrectionStepProps) {
  const errors = useMemo(
    () => findErrorsInSentences(originalText, correctionResult),
    [originalText, correctionResult]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'skipped' | null>(null);
  const [attempts, setAttempts] = useState<SelfCorrectionAttempt[]>([]);

  const current = errors[currentIndex];
  const isFinished = currentIndex >= errors.length;

  const correctCount = attempts.filter(a => a.wasCorrect).length;

  function handleCheck() {
    if (!current) return;
    const wasCorrect = input.trim().toLowerCase() === current.corrected.trim().toLowerCase();
    setFeedback(wasCorrect ? 'correct' : 'incorrect');
    setAttempts(prev => [...prev, {
      original: current.original,
      userAttempt: input.trim(),
      correct: current.corrected,
      wasCorrect,
      skipped: false,
    }]);
  }

  function handleSkip() {
    if (!current) return;
    setFeedback('skipped');
    setAttempts(prev => [...prev, {
      original: current.original,
      userAttempt: '',
      correct: current.corrected,
      wasCorrect: false,
      skipped: true,
    }]);
  }

  function handleNext() {
    setInput('');
    setFeedback(null);
    setCurrentIndex(prev => prev + 1);
  }

  function handleFinish() {
    onComplete(attempts);
  }

  if (isFinished) {
    return (
      <div className={styles.container}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryTitle}>Egenkorreksjon fullført</div>
          <div className={styles.summaryScore}>
            Du fikk {correctCount}/{attempts.length} riktig!
          </div>
          <div className={styles.summaryDetails}>
            {attempts.map((a, i) => (
              <div key={i} className={`${styles.summaryItem} ${a.wasCorrect ? styles.summaryCorrect : styles.summaryWrong}`}>
                <span className={styles.summaryOriginal}>{a.original}</span>
                <ArrowRight size={12} />
                <span>{a.correct}</span>
                {a.wasCorrect ? (
                  <span className={styles.badge + ' ' + styles.badgeCorrect}>Riktig</span>
                ) : a.skipped ? (
                  <span className={styles.badge + ' ' + styles.badgeSkipped}>Hoppet over</span>
                ) : (
                  <span className={styles.badge + ' ' + styles.badgeWrong}>Feil</span>
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleFinish}>Se fulle resultater</Button>
        </div>
      </div>
    );
  }

  const highlightedSentence = current.sentence.replace(
    current.original,
    `<mark>${current.original}</mark>`
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.stepLabel}>
          Feil {currentIndex + 1} av {errors.length}
        </span>
        <span className={styles.progress}>
          {correctCount} riktig så langt
        </span>
      </div>

      <div className={styles.sentenceCard}>
        <div className={styles.sentenceLabel}>Finn og fiks feilen:</div>
        <div
          className={styles.sentence}
          dangerouslySetInnerHTML={{ __html: highlightedSentence }}
        />
      </div>

      {!feedback ? (
        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Skriv den rettede versjonen..."
            onKeyDown={e => { if (e.key === 'Enter' && input.trim()) handleCheck(); }}
            autoFocus
          />
          <div className={styles.actions}>
            <Button onClick={handleCheck} disabled={!input.trim()} size="sm">
              <Check size={14} /> Sjekk
            </Button>
            <Button variant="ghost" onClick={handleSkip} size="sm">
              <SkipForward size={14} /> Hopp over
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.feedbackArea}>
          {feedback === 'correct' && (
            <div className={styles.feedbackCorrect}>
              Riktig! Svaret er <strong>{current.corrected}</strong>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className={styles.feedbackIncorrect}>
              Ikke helt. Riktig svar er <strong>{current.corrected}</strong>
              {input.trim() && (
                <div className={styles.yourAnswer}>Ditt svar: {input.trim()}</div>
              )}
            </div>
          )}
          {feedback === 'skipped' && (
            <div className={styles.feedbackSkipped}>
              Riktig svar er <strong>{current.corrected}</strong>
            </div>
          )}
          <Button onClick={handleNext} size="sm">
            {currentIndex + 1 < errors.length ? 'Neste' : 'Se oppsummering'}
          </Button>
        </div>
      )}
    </div>
  );
}

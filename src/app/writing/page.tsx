'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { Shuffle, ChevronDown, ChevronUp, RotateCcw, Clock, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WRITING_PROMPTS, type WritingPrompt } from '@/lib/prompts';
import type { CEFRLevel } from '@/lib/resources';
import { correctNorwegianText, type CorrectionResult } from '@/lib/claude';
import { WritingResults } from '@/components/writing/WritingResults';
import { SelfCorrectionStep } from '@/components/writing/SelfCorrectionStep';
import { WritingHistory } from '@/components/writing/WritingHistory';
import { useWritingHistory } from '@/lib/hooks/use-writing';
import { useTimer } from '@/lib/hooks/use-timer';
import { usePreferredLevel } from '@/lib/hooks/use-preferred-level';
import { formatDuration } from '@/lib/utils';
import type { SelfCorrectionAttempt } from '@/lib/db';
import styles from './page.module.css';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

type WritingPhase = 'write' | 'loading' | 'self-correct' | 'results';

export default function WritingPage() {
  const [phase, setPhase] = useState<WritingPhase>('write');
  const [preferredLevel] = usePreferredLevel();
  const [level, setLevel] = useState<CEFRLevel>(preferredLevel);
  const [freePlay, setFreePlay] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [text, setText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { saveSubmission } = useWritingHistory();
  const timer = useTimer();
  const timerStarted = useRef(false);

  // Auto-start writing timer on first keystroke
  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim() && !timerStarted.current) {
      timer.setCategory('writing');
      timer.start();
      timerStarted.current = true;
    }
  };

  // Auto-stop timer and return elapsed seconds
  const stopTimer = async () => {
    if (timerStarted.current) {
      timerStarted.current = false;
      await timer.stop();
    }
  };

  const promptsForLevel = useMemo(
    () => WRITING_PROMPTS.filter(p => p.level === level),
    [level],
  );

  const pickRandom = useCallback(() => {
    const available = promptsForLevel.filter(p => p.id !== prompt?.id);
    const pick = available[Math.floor(Math.random() * available.length)] ?? promptsForLevel[0];
    setPrompt(pick);
    setShowTranslation(false);
  }, [promptsForLevel, prompt?.id]);

  const handleLevelChange = (newLevel: CEFRLevel) => {
    setLevel(newLevel);
    const prompts = WRITING_PROMPTS.filter(p => p.level === newLevel);
    setPrompt(prompts[0] ?? null);
    setShowTranslation(false);
  };

  // Initialize prompt on first render
  if (!prompt && promptsForLevel.length > 0) {
    setPrompt(promptsForLevel[0]);
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await stopTimer();
    setPhase('loading');
    setError(null);
    setResult(null);
    try {
      const correction = await correctNorwegianText(text, level);
      setResult(correction);
      if (correction.corrections.length > 0) {
        setPhase('self-correct');
      } else {
        // No corrections — save immediately with empty self-corrections
        await saveSubmission({
          promptId: freePlay ? null : (prompt?.id ?? null),
          promptText: freePlay ? (customPrompt.trim() || 'Fri skriving') : (prompt?.prompt ?? 'Fri skriving'),
          level,
          originalText: text,
          correctionResult: correction,
          selfCorrections: [],
        });
        setPhase('results');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt.');
      setPhase('write');
    }
  };

  const handleSelfCorrectionComplete = async (attempts: SelfCorrectionAttempt[]) => {
    if (result) {
      await saveSubmission({
        promptId: freePlay ? null : (prompt?.id ?? null),
        promptText: freePlay ? (customPrompt.trim() || 'Fri skriving') : (prompt?.prompt ?? 'Fri skriving'),
        level,
        originalText: text,
        correctionResult: result,
        selfCorrections: attempts,
      });
    }
    setPhase('results');
  };

  const handleWriteAgain = () => {
    setText('');
    setResult(null);
    setError(null);
    timerStarted.current = false;
    timer.reset();
    setPhase('write');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Skriveøvelse ✍️</h1>

      {/* Write phase: prompt picker + textarea */}
      {phase === 'write' && (
        <>
          <div className={styles.promptSection}>
            <div className={styles.promptControls}>
              <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--color-surface)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-full)', padding: 'var(--space-1)' }}>
                {LEVELS.map(l => (
                  <button
                    key={l}
                    className={`${styles.filterBtn} ${level === l ? styles.filterBtnActive : ''}`}
                    onClick={() => handleLevelChange(l)}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      background: level === l ? 'var(--color-primary)' : 'transparent',
                      color: level === l ? 'white' : 'var(--color-text-secondary)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {!freePlay && (
                <Button variant="ghost" size="sm" onClick={pickRandom}>
                  <Shuffle size={14} /> Tilfeldig emne
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFreePlay(f => !f)}
                style={freePlay ? { color: 'var(--color-primary)', fontWeight: 600 } : undefined}
              >
                <PenLine size={14} /> Fri skriving
              </Button>
            </div>

            {freePlay ? (
              <div className={styles.freePlayCard}>
                <input
                  className={styles.freePlayInput}
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="Hva skriver du om? (valgfritt)"
                />
              </div>
            ) : prompt && (
              <div className={styles.promptCard}>
                <div className={styles.promptTopic}>{prompt.topic}</div>
                <div className={styles.promptText}>{prompt.prompt}</div>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-tertiary)',
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showTranslation ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showTranslation ? 'Skjul' : 'Vis'} engelsk
                </button>
                {showTranslation && (
                  <div className={styles.promptTranslation}>{prompt.promptEn}</div>
                )}
                {prompt.hints && prompt.hints.length > 0 && (
                  <div className={styles.promptHints}>
                    {prompt.hints.map((h, i) => (
                      <span key={i} className={styles.hint}>{h}</span>
                    ))}
                  </div>
                )}
                <div className={styles.promptMeta}>
                  Mål: ~{prompt.wordCountTarget} ord
                </div>
              </div>
            )}
          </div>

          <div className={styles.writingSection}>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={e => handleTextChange(e.target.value)}
              placeholder="Skriv her..."
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
            <div className={styles.writingFooter}>
              <span className={styles.wordCount}>
                {wordCount} ord
                {!freePlay && prompt ? ` / ~${prompt.wordCountTarget} mål` : ''}
                {timerStarted.current && timer.status === 'running' && (
                  <span className={styles.timerDisplay}>
                    <Clock size={12} /> {formatDuration(timer.elapsed)}
                  </span>
                )}
              </span>
              <Button
                onClick={handleSubmit}
                disabled={!text.trim()}
                size="md"
              >
                Sjekk skrivingen min
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Loading phase */}
      {phase === 'loading' && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Analyserer norsk...
        </div>
      )}

      {/* Error */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Self-correct phase */}
      {phase === 'self-correct' && result && (
        <SelfCorrectionStep
          originalText={text}
          correctionResult={result}
          onComplete={handleSelfCorrectionComplete}
        />
      )}

      {/* Results phase */}
      {phase === 'results' && result && (
        <>
          <WritingResults result={result} />
          <Button onClick={handleWriteAgain} variant="ghost">
            <RotateCcw size={14} /> Skriv igjen
          </Button>
        </>
      )}

      {/* History section */}
      <WritingHistory />
    </div>
  );
}

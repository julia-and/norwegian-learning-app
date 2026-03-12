'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Lightbulb, Send, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { WritingResults } from '@/components/writing/WritingResults';
import { SCENARIOS, scenariosForLevel, type ConversationScenario } from '@/lib/scenarios';
import type { CEFRLevel } from '@/lib/resources';
import { sendConversationTurn, type ChatMessage } from '@/lib/converse';
import { correctNorwegianText, type CorrectionResult } from '@/lib/claude';
import { useTimer } from '@/lib/hooks/use-timer';
import { useConversation } from '@/lib/hooks/use-conversation';
import { formatDuration } from '@/lib/utils';
import styles from './page.module.css';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

type Phase = 'idle' | 'active' | 'awaiting-ai' | 'reviewing' | 'done';

export default function ConversationPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [level, setLevel] = useState<CEFRLevel>('A2');
  const [scenario, setScenario] = useState<ConversationScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timerDuration, setTimerDuration] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timer = useTimer();
  const { saveSession } = useConversation();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startScenario = useCallback((s: ConversationScenario) => {
    setScenario(s);
    setMessages([{ role: 'assistant', content: s.openingLine }]);
    setTurnCount(0);
    setHint(null);
    setShowHint(false);
    setError(null);
    setCorrection(null);
    timer.setCategory('speaking');
    timer.start();
    setPhase('active');
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [timer]);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || !scenario || phase !== 'active') return;

    const userMessage: ChatMessage = { role: 'user', content: inputText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setShowHint(false);
    setPhase('awaiting-ai');

    const newTurnCount = turnCount + 1;
    setTurnCount(newTurnCount);

    try {
      const result = await sendConversationTurn(newMessages, scenario, level, newTurnCount);
      const updatedMessages = [...newMessages, { role: 'assistant' as const, content: result.reply }];
      setMessages(updatedMessages);

      if (result.isComplete) {
        setHint(null);
        await handleReview(updatedMessages, newTurnCount);
      } else {
        setHint(result.hint || null);
        setPhase('active');
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt.');
      setPhase('active');
    }
  }, [inputText, messages, scenario, phase, turnCount, level]);

  const handleReview = useCallback(async (allMessages: ChatMessage[], finalTurnCount: number) => {
    setPhase('reviewing');
    const timerSession = await timer.stop();
    setTimerDuration(timerSession?.durationSeconds ?? 0);

    const userText = allMessages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');

    if (!userText.trim() || !scenario) {
      setPhase('done');
      return;
    }

    try {
      const correctionResult = await correctNorwegianText(userText, level);
      setCorrection(correctionResult);

      await saveSession({
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        level,
        messages: allMessages,
        turnCount: finalTurnCount,
        timerSessionId: timerSession?.id,
        correctionResult,
        createdAt: new Date(),
        completedAt: new Date(),
      });

      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt under vurdering.');
      setPhase('done');
    }
  }, [timer, scenario, level, saveSession]);

  const handleEndEarly = useCallback(async () => {
    if (!scenario) return;
    await handleReview(messages, turnCount);
  }, [handleReview, messages, turnCount, scenario]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetToIdle = () => {
    timer.reset();
    setPhase('idle');
    setScenario(null);
    setMessages([]);
    setInputText('');
    setHint(null);
    setShowHint(false);
    setTurnCount(0);
    setCorrection(null);
    setError(null);
    setTimerDuration(0);
  };

  const scenariosForCurrentLevel = scenariosForLevel(level);
  const isChat = phase === 'active' || phase === 'awaiting-ai';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Samtaleøvelse 💬</h1>

      {/* ── Phase: idle — scenario picker ── */}
      {phase === 'idle' && (
        <>
          <div className={styles.levelFilter}>
            {LEVELS.map(l => (
              <button
                key={l}
                className={`${styles.levelBtn} ${level === l ? styles.levelBtnActive : ''}`}
                onClick={() => setLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>

          <div className={styles.scenarioGrid}>
            {scenariosForCurrentLevel.map(s => (
              <button
                key={s.id}
                className={styles.scenarioCard}
                onClick={() => startScenario(s)}
              >
                <div className={styles.scenarioTitle}>{s.title}</div>
                <div className={styles.scenarioTitleEn}>{s.titleEn}</div>
                <div className={styles.scenarioMeta}>
                  ~{s.maxTurns} utvekslinger
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Phase: active / awaiting-ai — chat UI ── */}
      {(isChat || phase === 'reviewing') && scenario && (
        <>
          <div className={styles.chatHeader}>
            <div>
              <div className={styles.chatScenarioTitle}>{scenario.title}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {scenario.situationEn}
              </div>
            </div>
            <div className={styles.chatCounter}>
              Tur {turnCount} / ~{scenario.maxTurns}
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={styles.bubbleRole}>
                  {msg.role === 'assistant' ? scenario.title : 'Du'}
                </div>
                <div
                  className={`${styles.bubble} ${
                    msg.role === 'assistant' ? styles.bubbleAssistant : styles.bubbleUser
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {phase === 'awaiting-ai' && (
              <div>
                <div className={styles.bubbleRole}>{scenario.title}</div>
                <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                  <div className={styles.spinner} style={{ width: 16, height: 16 }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {phase === 'reviewing' && (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              Vurderer svarene dine…
            </div>
          )}
        </>
      )}

      {/* Input area — only shown when active */}
      {isChat && (
        <div className={styles.inputArea}>
          {showHint && hint && (
            <div className={styles.hintArea}>
              <span className={styles.hintLabel}>Hint:</span>
              {hint}
            </div>
          )}

          <div className={styles.inputRow}>
            <textarea
              ref={textareaRef}
              className={styles.chatTextarea}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skriv svaret ditt her… (Enter for å sende)"
              disabled={phase === 'awaiting-ai'}
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={phase === 'awaiting-ai' || !inputText.trim()}
              size="md"
            >
              <Send size={16} />
            </Button>
          </div>

          <div className={styles.inputActions}>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {hint && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(v => !v)}
                  disabled={phase === 'awaiting-ai'}
                >
                  <Lightbulb size={14} />
                  {showHint ? 'Skjul hint' : 'Vis hint'}
                </Button>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEndEarly}
              disabled={phase === 'awaiting-ai' || turnCount === 0}
            >
              Avslutt samtale
            </Button>
          </div>
        </div>
      )}

      {/* ── Phase: done ── */}
      {phase === 'done' && scenario && (
        <>
          <Card>
            <div className={styles.summaryCard}>
              <div style={{ fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                {scenario.title} — fullført
              </div>
              <div className={styles.summaryRow}>
                <div className={styles.summaryStat}>
                  <span className={styles.summaryStatLabel}>Turer</span>
                  <span className={styles.summaryStatValue}>{turnCount}</span>
                </div>
                {timerDuration > 0 && (
                  <div className={styles.summaryStat}>
                    <span className={styles.summaryStatLabel}>Tid</span>
                    <span className={styles.summaryStatValue}>{formatDuration(timerDuration)}</span>
                  </div>
                )}
                <div className={styles.summaryStat}>
                  <span className={styles.summaryStatLabel}>Nivå</span>
                  <span className={styles.summaryStatValue}>{level}</span>
                </div>
              </div>
            </div>
          </Card>

          {correction && <WritingResults result={correction} />}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.doneActions}>
            <Button onClick={resetToIdle}>
              <RotateCcw size={14} /> Ny samtale
            </Button>
            <Button variant="ghost" onClick={() => startScenario(scenario)}>
              Prøv igjen
            </Button>
          </div>
        </>
      )}

      {error && (phase === 'active' || phase === 'awaiting-ai') && (
        <div className={styles.error}>{error}</div>
      )}
    </div>
  );
}

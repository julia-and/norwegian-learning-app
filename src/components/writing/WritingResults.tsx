'use client';

import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { CorrectionResult } from '@/lib/claude';
import styles from './writing-results.module.css';

interface WritingResultsProps {
  result: CorrectionResult;
}

export function WritingResults({ result }: WritingResultsProps) {
  return (
    <div className={styles.resultsSection}>
      <div className={styles.resultHeader}>
        <span className={styles.resultTitle}>Resultater</span>
        <div className={styles.fluencyBar}>
          Flyt
          <div className={styles.fluencyDots}>
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                className={`${styles.fluencyDot} ${n <= result.fluencyRating ? styles.fluencyDotFilled : ''}`}
              />
            ))}
          </div>
          {result.fluencyRating}/5
        </div>
      </div>

      <Card>
        <div className={styles.assessment}>{result.assessment}</div>
      </Card>

      <Card>
        <div className={styles.correctedTextLabel}>Rettet tekst</div>
        <div className={styles.correctedText}>{result.correctedText}</div>
      </Card>

      {result.corrections.length > 0 ? (
        <Card>
          <div style={{ padding: 0 }}>
            <div style={{ fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              Rettelser ({result.corrections.length})
            </div>
            <div className={styles.corrections}>
              {result.corrections.map((c, i) => (
                <div key={i} className={styles.correctionItem}>
                  <div className={styles.correctionDiff}>
                    <span className={styles.correctionOriginal}>{c.original}</span>
                    <ArrowRight size={14} className={styles.correctionArrow} />
                    <span className={styles.correctionFixed}>{c.corrected}</span>
                  </div>
                  <div className={styles.correctionExplanation}>{c.explanation}</div>
                  {c.rule && <div className={styles.correctionRule}>{c.rule}</div>}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className={styles.noCorrections}>
            Ingen rettelser nødvendig — bra jobba!
          </div>
        </Card>
      )}

      {result.notes && result.notes.length > 0 && (
        <Card>
          <div className={styles.notesSuggestions}>
            <span className={styles.notesLabel}>Notater</span>
            {result.notes.map((n, i) => (
              <div key={i} className={styles.noteItem}>{n}</div>
            ))}
          </div>
        </Card>
      )}

      {result.vocabularySuggestions.length > 0 && (
        <Card>
          <div className={styles.vocabSuggestions}>
            <span className={styles.vocabLabel}>Ordforrådsforslag</span>
            {result.vocabularySuggestions.map((v, i) => (
              <div key={i} className={styles.vocabItem}>{v}</div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

'use client';

import styles from './TappableText.module.css';

interface TappableTextProps {
  text: string;
  vocabulary: Record<string, string>;
  onWordTap: (word: string, translation: string | null, rect: DOMRect) => void;
}

export function TappableText({ text, vocabulary, onWordTap }: TappableTextProps) {
  const tokens = text.split(/(\s+)/);

  return (
    <span>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return token;
        const clean = token.toLowerCase().replace(/^[^a-zæøå]+|[^a-zæøå]+$/gi, '');
        const hasTranslation = clean.length > 0 && clean in vocabulary;
        return (
          <span
            key={i}
            className={`${styles.word} ${hasTranslation ? styles.known : ''}`}
            onClick={e => {
              if (clean.length === 0) return;
              const translation = vocabulary[clean] ?? null;
              onWordTap(clean, translation, (e.currentTarget as HTMLElement).getBoundingClientRect());
            }}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
}

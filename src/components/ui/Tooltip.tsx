'use client';

import styles from './tooltip.module.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <span
      className={styles.wrapper}
      data-tooltip={content}
      data-position={position}
    >
      {children}
    </span>
  );
}

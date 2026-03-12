import { HTMLAttributes, ReactNode } from 'react';
import styles from './card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  compact?: boolean;
}

export function Card({ elevated, compact, className, ...props }: CardProps) {
  const classes = [
    styles.card,
    elevated && styles.elevated,
    compact && styles.compact,
    className,
  ].filter(Boolean).join(' ');

  return <div className={classes} {...props} />;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

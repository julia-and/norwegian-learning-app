import { HTMLAttributes } from 'react';
import styles from './badge.module.css';

type BadgeVariant = 'default' | 'primary' | 'success' | 'accent' | 'danger' |
  'reading' | 'writing' | 'listening' | 'speaking' | 'vocabulary';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(' ');
  return <span className={classes} {...props} />;
}

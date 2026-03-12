'use client';

import { InputHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import styles from './checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}

export function Checkbox({ label, checked, className, ...props }: CheckboxProps) {
  const wrapperClasses = [
    styles.wrapper,
    checked && styles.checked,
    className,
  ].filter(Boolean).join(' ');

  return (
    <label className={wrapperClasses}>
      <span className={styles.checkbox}>
        <input type="checkbox" className={styles.input} checked={checked} {...props} />
        <span className={styles.box}>
          <Check size={14} strokeWidth={3} className={styles.checkIcon} />
        </span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

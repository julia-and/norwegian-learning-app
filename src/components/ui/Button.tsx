import { ButtonHTMLAttributes, forwardRef } from 'react';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', iconOnly, className, ...props }, ref) => {
    const classes = [
      styles.button,
      styles[variant],
      styles[size],
      iconOnly && styles.iconOnly,
      className,
    ].filter(Boolean).join(' ');

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = 'Button';

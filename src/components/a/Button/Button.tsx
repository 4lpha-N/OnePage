import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  active?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  active = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    'Button',
    `Button--${variant}`,
    active && 'Button--active',
    disabled && 'Button--disabled',
    fullWidth && 'Button--full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
      aria-pressed={active ? true : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}

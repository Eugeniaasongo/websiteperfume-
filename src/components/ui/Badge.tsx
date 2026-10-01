import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'dark' | 'alert' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'gold', size = 'sm', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-semibold tracking-wider uppercase rounded-none';

  const variants = {
    gold: 'bg-gold/15 text-gold-deep border border-gold/30',
    dark: 'bg-ink text-paper border border-ink',
    alert: 'bg-alert-red/10 text-alert-red border border-alert-red/30',
    outline: 'bg-transparent text-charcoal border border-charcoal/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))} {...props}>
      {children}
    </span>
  );
}

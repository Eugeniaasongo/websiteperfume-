import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'soft' | 'bordered';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const baseStyles = 'bg-paper p-6 transition-shadow duration-200';
  const variants = {
    default: 'shadow-sm border border-charcoal/10',
    soft: 'bg-paper-soft border border-gold/10',
    bordered: 'border border-gold',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
}

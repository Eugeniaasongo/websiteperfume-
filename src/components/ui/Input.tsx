import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold tracking-wider uppercase text-charcoal">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 text-sm bg-paper border border-charcoal/20 text-ink placeholder:text-charcoal/40 transition-colors duration-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:bg-paper-soft disabled:cursor-not-allowed',
              error && 'border-alert-red focus:border-alert-red focus:ring-alert-red',
              className
            )
          )}
          {...props}
        />
        {error && <p className="text-xs text-alert-red mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-xs text-charcoal/60 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

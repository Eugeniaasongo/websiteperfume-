'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'right' | 'left';
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, position = 'right', children }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`fixed inset-y-0 ${
          position === 'right' ? 'right-0' : 'left-0'
        } max-w-full flex w-full sm:w-96 bg-paper shadow-2xl border-l border-gold/20 flex-col z-10 transition-transform duration-300 transform`}
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 flex items-center justify-between border-b border-charcoal/10 bg-paper-soft">
          {title && <h2 className="text-lg font-serif text-ink tracking-wide">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

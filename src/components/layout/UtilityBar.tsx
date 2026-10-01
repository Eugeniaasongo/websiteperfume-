import React from 'react';
import { brandConfig } from '@/config/brand';

export function UtilityBar() {
  return (
    <div className="bg-ink text-paper text-xs py-2 px-4 border-b border-charcoal">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-paper/80">{brandConfig.contact.phone} • {brandConfig.contact.email}</div>
        <span className="text-gold uppercase tracking-wider text-[11px]">Accra Showroom</span>
      </div>
    </div>
  );
}

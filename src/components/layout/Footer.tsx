import React from 'react';
import { brandConfig } from '@/config/brand';

export function Footer() {
  return (
    <footer className="bg-charcoal text-paper py-12 px-6 border-t-2 border-gold text-xs text-center space-y-2">
      <p className="font-serif text-lg text-gold">{brandConfig.name}</p>
      <p>{brandConfig.contact.address} • {brandConfig.contact.phone}</p>
      <p>© {new Date().getFullYear()} {brandConfig.name}. All rights reserved.</p>
    </footer>
  );
}

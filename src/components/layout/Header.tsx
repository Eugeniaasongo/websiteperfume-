import React from 'react';
import Link from 'next/link';
import { brandConfig } from '@/config/brand';

export function Header() {
  return (
    <header className="bg-paper border-b border-gold/20 py-4 px-6 text-center">
      <Link href="/">
        <h1 className="font-serif text-3xl font-semibold text-ink tracking-widest uppercase">
          {brandConfig.name}
        </h1>
        <p className="text-[10px] text-gold uppercase tracking-widest">{brandConfig.tagline}</p>
      </Link>
    </header>
  );
}

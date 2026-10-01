'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/config/brand';

export interface SearchResultItem {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  lowestPrice: number;
  imageUrl: string;
  gender: string;
}

export interface InstantSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstantSearchModal({ isOpen, onClose }: InstantSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-ink/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-paper border border-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 bg-paper-soft border-b border-gold/20 flex items-center space-x-3">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fragrances by name, note (Oud, Cocoa, Bergamot), or family..."
            autoFocus
            className="w-full bg-transparent text-sm md:text-base font-sans text-ink placeholder:text-charcoal/40 focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-gold animate-spin shrink-0" />
          ) : (
            <button
              onClick={onClose}
              className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!query.trim() && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold block">
                Popular Olfactory Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Akoben Oud', 'Sika Sunset', 'Sea Salt & Coconut', 'Perfume Oils', 'Extrait de Parfum'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-xs bg-paper-soft border border-charcoal/10 hover:border-gold text-charcoal transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="text-center py-8 text-charcoal/60 space-y-1">
              <p className="font-serif text-lg text-ink">No fragrances found for "{query}"</p>
              <p className="text-xs">Try searching for notes like Oud, Honey, Cocoa, or Vanilla.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gold block">
                Search Results ({results.length})
              </span>
              <div className="divide-y divide-charcoal/10">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center space-x-4 py-3 group hover:bg-paper-soft px-2 transition-colors"
                  >
                    <div className="w-14 h-14 bg-paper-soft border border-charcoal/10 shrink-0 p-1">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold block">
                        {p.gender}
                      </span>
                      <h4 className="font-serif text-base font-semibold text-ink group-hover:text-gold transition-colors truncate">
                        {p.name}
                      </h4>
                      {p.tagline && <p className="text-xs text-charcoal/60 truncate">{p.tagline}</p>}
                    </div>
                    <span className="text-sm font-bold text-ink shrink-0">{formatPrice(p.lowestPrice)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

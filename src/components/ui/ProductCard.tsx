import React from 'react';
import Link from 'next/link';
import { Badge } from './Badge';
import { formatPrice } from '@/config/brand';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  outOfStock?: boolean;
  onQuickView?: (id: string) => void;
}

export function ProductCard({
  id,
  slug,
  name,
  subtitle,
  price,
  image,
  category,
  isNew,
  isBestseller,
  outOfStock = false,
  onQuickView,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col bg-paper border border-charcoal/10 hover:border-gold/40 transition-all duration-300">
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
        {outOfStock ? (
          <Badge variant="alert">Out of stock</Badge>
        ) : (
          <>
            {isNew && <Badge variant="gold">New</Badge>}
            {isBestseller && <Badge variant="dark">Bestseller</Badge>}
          </>
        )}
      </div>

      <div className="relative aspect-square w-full overflow-hidden bg-paper-soft flex items-center justify-center p-6">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {onQuickView && !outOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(id);
              }}
              className="w-full bg-paper/95 text-ink hover:bg-gold hover:text-white text-xs font-semibold uppercase tracking-wider py-2 transition-colors border border-gold/30"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 text-center">
        {category && (
          <span className="text-[11px] font-medium uppercase tracking-widest text-charcoal/50 mb-1">
            {category}
          </span>
        )}
        <Link href={`/products/${slug}`} className="hover:text-gold transition-colors">
          <h3 className="font-serif text-lg text-ink tracking-tight line-clamp-1">{name}</h3>
        </Link>
        {subtitle && (
          <p className="text-xs text-charcoal/60 line-clamp-1 mt-0.5 italic">{subtitle}</p>
        )}
        <div className="mt-3 text-sm font-semibold text-ink">
          {formatPrice(price)}
        </div>
      </div>
    </div>
  );
}

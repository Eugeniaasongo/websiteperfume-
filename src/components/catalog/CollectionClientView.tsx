'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  gender: string;
  categoryName: string | null;
  lowestPrice: number;
  totalStock: number;
  isNew: boolean;
  isBestseller: boolean;
  imageUrl: string;
  sizeVariants: string[];
}

export interface CollectionClientViewProps {
  title: string;
  description: string;
  initialProducts: ProductItem[];
}

export function CollectionClientView({
  title,
  description,
  initialProducts,
}: CollectionClientViewProps) {
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedSize, setSelectedSize] = useState<string>('ALL');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredProducts = initialProducts.filter((p) => {
    if (selectedGender !== 'ALL' && p.gender !== selectedGender) return false;
    if (selectedSize !== 'ALL' && !p.sizeVariants.includes(selectedSize)) return false;
    if (inStockOnly && p.totalStock <= 0) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aStock = a.totalStock > 0 ? 1 : 0;
    const bStock = b.totalStock > 0 ? 1 : 0;
    if (aStock !== bStock) return bStock - aStock;

    if (sortBy === 'price-asc') return a.lowestPrice - b.lowestPrice;
    if (sortBy === 'price-desc') return b.lowestPrice - a.lowestPrice;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold">
          Fragrance Catalog
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-ink tracking-tight">{title}</h1>
        <p className="text-sm text-charcoal/70 leading-relaxed font-sans">{description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-64 bg-paper-soft p-6 border border-gold/15 space-y-6 shrink-0">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold border-b border-gold/20 pb-2">
            Refine By
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-charcoal block">
              Scent Gender
            </label>
            <div className="flex flex-col space-y-1.5 text-xs text-charcoal">
              {['ALL', 'WOMEN', 'MEN', 'UNISEX', 'MAKEUP'].map((g) => (
                <label key={g} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={selectedGender === g}
                    onChange={() => setSelectedGender(g)}
                    className="accent-gold"
                  />
                  <span>{g === 'ALL' ? 'All Collections' : g}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-charcoal/10">
            <label className="text-xs font-semibold uppercase text-charcoal block">Size</label>
            <div className="flex flex-wrap gap-2">
              {['ALL', '30ml', '50ml', '100ml'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1 text-xs border ${
                    selectedSize === sz
                      ? 'bg-gold text-white border-gold'
                      : 'bg-paper text-charcoal border-charcoal/20 hover:border-gold'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-charcoal/10">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold uppercase text-charcoal">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-gold"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-charcoal/10 gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-charcoal/70">
              Showing {displayedProducts.length} of {sortedProducts.length} Fragrances
            </span>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                Sort:
              </span>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { label: 'Featured Selection', value: 'featured' },
                  { label: 'Price: Low to High', value: 'price-asc' },
                  { label: 'Price: High to Low', value: 'price-desc' },
                  { label: 'Name (A-Z)', value: 'name' },
                ]}
                className="py-1.5 text-xs w-48"
              />
            </div>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  subtitle={product.tagline || undefined}
                  price={product.lowestPrice}
                  image={product.imageUrl}
                  category={product.gender}
                  isNew={product.isNew}
                  isBestseller={product.isBestseller}
                  outOfStock={product.totalStock <= 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-paper-soft border border-charcoal/10 p-8">
              <p className="text-lg font-serif text-ink">No fragrances found</p>
              <p className="text-xs text-charcoal/60 mt-1">
                Try adjusting your filters or search criteria.
              </p>
            </div>
          )}

          {visibleCount < sortedProducts.length && (
            <div className="text-center pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                Load More Fragrances ({sortedProducts.length - visibleCount} Remaining)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

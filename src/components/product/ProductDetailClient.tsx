'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, brandConfig } from '@/config/brand';
import { MessageCircle, ShieldCheck, Truck, Star } from 'lucide-react';

export interface VariantData {
  id: string;
  sku: string;
  size: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
}

export interface ScentNoteData {
  id: string;
  type: string;
  name: string;
}

export interface ReviewData {
  id: string;
  rating: number;
  authorName: string;
  title: string | null;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ProductDetailClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    description: string;
    gender: string;
    longevity: number;
    projection: number;
    occasionTags: string;
    seasonTags: string;
    variants: VariantData[];
    images: { id: string; url: string; altText: string | null }[];
    scentNotes: ScentNoteData[];
    reviews: ReviewData[];
  };
  similarProducts: {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
    gender: string;
  }[];
}

export function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantData>(
    product.variants[0] || {
      id: 'default',
      sku: 'SKU-DEF',
      size: '50ml',
      price: 0,
      compareAtPrice: null,
      stock: 0,
    }
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const topNotes = product.scentNotes.filter((n) => n.type === 'TOP');
  const heartNotes = product.scentNotes.filter((n) => n.type === 'HEART');
  const baseNotes = product.scentNotes.filter((n) => n.type === 'BASE');

  const whatsappMessage = encodeURIComponent(
    `Hello ${brandConfig.name}, I would like to ask about the fragrance "${product.name}" (${selectedVariant.size} - ${formatPrice(selectedVariant.price)}).`
  );
  const whatsappUrl = `https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-paper-soft border border-charcoal/10 overflow-hidden group">
            <img
              src={
                product.images[activeImageIndex]?.url ||
                'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80'
              }
              alt={product.name}
              className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 border bg-paper-soft shrink-0 overflow-hidden p-2 transition-all ${
                    idx === activeImageIndex ? 'border-gold ring-1 ring-gold' : 'border-charcoal/20 opacity-70'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {product.gender} • Extrait de Parfum
            </span>
            <h1 className="text-3xl md:text-4xl font-serif text-ink tracking-tight mt-1">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-sm italic text-charcoal/70 mt-1">{product.tagline}</p>
            )}
          </div>

          <div className="flex items-baseline space-x-4 border-y border-charcoal/10 py-4">
            <span className="text-2xl font-bold text-ink">{formatPrice(selectedVariant.price)}</span>
            {selectedVariant.compareAtPrice && (
              <span className="text-sm line-through text-charcoal/50">
                {formatPrice(selectedVariant.compareAtPrice)}
              </span>
            )}
            <div className="ml-auto">
              {selectedVariant.stock > 0 ? (
                <Badge variant="gold">
                  {selectedVariant.stock <= 5 ? `Low Stock: Only ${selectedVariant.stock} left` : 'In Stock'}
                </Badge>
              ) : (
                <Badge variant="alert">Out of Stock</Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
            {product.description}
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal block">
              Select Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`py-3 px-2 border text-center transition-all ${
                    selectedVariant.id === variant.id
                      ? 'border-gold bg-gold/10 text-gold-deep font-semibold'
                      : 'border-charcoal/20 bg-paper text-charcoal hover:border-gold/50'
                  }`}
                >
                  <div className="text-xs uppercase font-bold">{variant.size}</div>
                  <div className="text-[11px] text-charcoal/70 mt-0.5">{formatPrice(variant.price)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center border border-charcoal/20 bg-paper">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-sm text-charcoal hover:text-gold"
              >
                -
              </button>
              <span className="px-4 py-2 text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-sm text-charcoal hover:text-gold"
              >
                +
              </button>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={selectedVariant.stock <= 0}
              onClick={handleAddToCart}
            >
              {selectedVariant.stock > 0 ? 'Add to Cart' : 'Notify When Back in Stock'}
            </Button>
          </div>

          {addedToast && (
            <div className="p-3 bg-gold/15 border border-gold text-gold-deep text-xs font-semibold uppercase tracking-wider animate-fadeIn">
              ✓ Added {quantity} x {product.name} ({selectedVariant.size}) to cart
            </div>
          )}

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-charcoal hover:text-gold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Ask a Scent Specialist on WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-charcoal/10 text-xs text-charcoal/80">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>100% Authentic Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-gold" />
              <span>Accra Same-Day / Ghana 48h</span>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-paper-soft border border-gold/20 p-8 md:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold">
            Fragrance Architecture
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-ink mt-1">Scent Pyramid & Performance</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="p-4 bg-paper border border-gold/20">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                Top Notes (First Impression)
              </span>
              <p className="text-xs font-medium text-ink mt-1">
                {topNotes.map((n) => n.name).join(', ') || 'Fresh Citrus & Aromatic Botanicals'}
              </p>
            </div>
            <div className="p-4 bg-paper border border-gold/30">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                Heart Notes (The Soul)
              </span>
              <p className="text-xs font-medium text-ink mt-1">
                {heartNotes.map((n) => n.name).join(', ') || 'Ghanaian Cocoa, Spice & Floral Absolutes'}
              </p>
            </div>
            <div className="p-4 bg-paper border border-gold/40">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                Base Notes (The Memory)
              </span>
              <p className="text-xs font-medium text-ink mt-1">
                {baseNotes.map((n) => n.name).join(', ') || 'Smoked Oud, Amber Resin & Sandalwood'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                <span>Longevity</span>
                <span>{product.longevity} / 5 (10-14 Hours)</span>
              </div>
              <div className="w-full h-2 bg-charcoal/10 overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${(product.longevity / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                <span>Projection & Sillage</span>
                <span>{product.projection} / 5 (Strong Radiance)</span>
              </div>
              <div className="w-full h-2 bg-charcoal/10 overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${(product.projection / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-charcoal/10 text-xs space-y-2">
              <p>
                <strong>Occasion:</strong> {product.occasionTags || 'Versatile Luxury'}
              </p>
              <p>
                <strong>Recommended Season:</strong> {product.seasonTags || 'Year-Round'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="border-b border-gold/20 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif text-ink">Verified Reviews ({product.reviews.length})</h2>
          <div className="flex items-center space-x-1 text-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold" />
            ))}
            <span className="text-xs font-semibold text-ink ml-2">5.0 / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-paper border border-charcoal/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-ink">{rev.authorName}</span>
                {rev.verifiedPurchase && (
                  <Badge variant="gold" size="sm">
                    Verified Buyer
                  </Badge>
                )}
              </div>
              {rev.title && <h4 className="font-serif font-bold text-sm text-ink">{rev.title}</h4>}
              <p className="text-xs text-charcoal/80 leading-relaxed font-sans">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {similarProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-gold/20">
          <h2 className="text-2xl font-serif text-ink">Similar Olfactory Profiles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((sim) => (
              <a
                key={sim.id}
                href={`/products/${sim.slug}`}
                className="group block bg-paper border border-charcoal/10 p-4 text-center hover:border-gold transition-colors"
              >
                <div className="aspect-square bg-paper-soft overflow-hidden p-4 mb-3">
                  <img
                    src={sim.imageUrl}
                    alt={sim.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-serif text-sm font-semibold text-ink group-hover:text-gold transition-colors">
                  {sim.name}
                </h4>
                <p className="text-xs font-bold text-ink mt-1">{formatPrice(sim.price)}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-0 inset-x-0 bg-paper border-t border-gold/30 p-4 flex items-center justify-between z-40 md:hidden shadow-2xl">
        <div>
          <div className="text-xs font-bold text-ink">{product.name}</div>
          <div className="text-xs text-gold font-semibold">{formatPrice(selectedVariant.price)}</div>
        </div>
        <Button size="sm" onClick={handleAddToCart} disabled={selectedVariant.stock <= 0}>
          {selectedVariant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
}

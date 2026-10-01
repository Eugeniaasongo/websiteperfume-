'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/config/brand';
import { ShoppingBag, Trash2, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartDrawerOpen,
    closeCartDrawer,
    subtotal,
    totalCount,
    appliedCoupon,
    discountPercentage,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const discountAmount = (subtotal * discountPercentage) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
    } else {
      setCouponError('Invalid discount code. Try "AKWAABA10"');
    }
  };

  return (
    <Drawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} title={`Your Shopping Bag (${totalCount})`}>
      {items.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <ShoppingBag className="w-12 h-12 text-gold/50 mx-auto" />
          <h3 className="font-serif text-xl text-ink">Your bag is empty</h3>
          <p className="text-xs text-charcoal/60 max-w-xs mx-auto">
            Discover our luxury Ghanaian fragrance extraits and botanical oils.
          </p>
          <div className="pt-2">
            <Link href="/collections/all" onClick={closeCartDrawer}>
              <Button size="sm">Explore Fragrances</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between space-y-6">
          <div className="divide-y divide-charcoal/10 max-h-[50vh] overflow-y-auto pr-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="pt-4 flex space-x-3 items-center">
                <div className="w-16 h-16 bg-paper-soft border border-charcoal/10 shrink-0 p-1">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-ink truncate">{item.productName}</h4>
                  <span className="text-[11px] font-medium text-gold uppercase block">{item.size}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-5 h-5 border border-charcoal/20 flex items-center justify-center text-xs hover:border-gold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-5 h-5 border border-charcoal/20 flex items-center justify-center text-xs hover:border-gold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-ink">{formatPrice(item.price * item.quantity)}</div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-charcoal/40 hover:text-alert-red transition-colors mt-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gold/20 pt-4 space-y-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-gold/15 border border-gold/30 text-xs">
                <div className="flex items-center space-x-2 text-gold-deep font-semibold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Code '{appliedCoupon}' ({discountPercentage}% OFF)</span>
                </div>
                <button onClick={removeCoupon} className="text-alert-red hover:underline text-[11px] font-bold">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <Input
                  placeholder="Discount Code (e.g. AKWAABA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="py-1.5 text-xs"
                />
                <Button type="submit" size="sm" variant="outline" className="shrink-0">
                  Apply
                </Button>
              </form>
            )}
            {couponError && <p className="text-[11px] text-alert-red">{couponError}</p>}
          </div>

          <div className="border-t border-charcoal/10 pt-4 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-charcoal/80">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-gold-deep font-semibold">
                  <span>Discount ({discountPercentage}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-ink pt-2 border-t border-charcoal/10">
                <span>Estimated Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={closeCartDrawer} className="block w-full">
              <Button variant="primary" size="lg" className="w-full flex items-center justify-center space-x-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}

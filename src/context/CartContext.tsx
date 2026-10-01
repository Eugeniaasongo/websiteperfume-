'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  subtotal: number;
  totalCount: number;
  appliedCoupon: string | null;
  discountPercentage: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ghana_perfume_cart');
      if (saved) setItems(JSON.parse(saved));
      const savedCoupon = localStorage.getItem('ghana_perfume_coupon');
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        setAppliedCoupon(parsed.code);
        setDiscountPercentage(parsed.percentage);
      }
    } catch (e) {
      console.error('Failed loading cart', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ghana_perfume_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed saving cart', e);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === newItem.variantId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].maxStock,
          updated[existingIndex].quantity + newItem.quantity
        );
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      }
      return [...prev, { ...newItem, id: `${newItem.variantId}-${Date.now()}` }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(item.maxStock, nextQty) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountPercentage(0);
    localStorage.removeItem('ghana_perfume_cart');
    localStorage.removeItem('ghana_perfume_coupon');
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'AKWAABA10') {
      setAppliedCoupon('AKWAABA10');
      setDiscountPercentage(10);
      localStorage.setItem('ghana_perfume_coupon', JSON.stringify({ code: 'AKWAABA10', percentage: 10 }));
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercentage(0);
    localStorage.removeItem('ghana_perfume_coupon');
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        subtotal,
        totalCount,
        appliedCoupon,
        discountPercentage,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

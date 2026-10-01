import { describe, it, expect } from 'vitest';

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'COD_PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const ALLOWED: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAID', 'COD_PENDING', 'CANCELLED'],
  PAID: ['PROCESSING', 'CANCELLED'],
  COD_PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  return ALLOWED[from]?.includes(to) || false;
}

export function formatPrice(amount: number): string {
  return `₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

describe('E-Commerce Core Business Rules', () => {
  it('correctly validates order state machine transitions', () => {
    expect(canTransition('PENDING_PAYMENT', 'PAID')).toBe(true);
    expect(canTransition('PENDING_PAYMENT', 'COD_PENDING')).toBe(true);
    expect(canTransition('PAID', 'PROCESSING')).toBe(true);
    expect(canTransition('PROCESSING', 'SHIPPED')).toBe(true);
    expect(canTransition('SHIPPED', 'DELIVERED')).toBe(true);
    expect(canTransition('PENDING_PAYMENT', 'DELIVERED')).toBe(false);
    expect(canTransition('DELIVERED', 'PROCESSING')).toBe(false);
  });

  it('formats Ghanaian Cedi (GHS ₵) prices accurately', () => {
    expect(formatPrice(650)).toBe('₵650.00');
    expect(formatPrice(1250.5)).toBe('₵1,250.50');
  });
});

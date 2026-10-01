export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'COD_PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAID', 'COD_PENDING', 'CANCELLED', 'FAILED'],
  PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
  COD_PENDING: ['PROCESSING', 'CANCELLED', 'FAILED'],
  PROCESSING: ['SHIPPED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED', 'CANCELLED'],
  DELIVERED: ['REFUNDED', 'PARTIALLY_REFUNDED'],
  CANCELLED: [],
  FAILED: ['PENDING_PAYMENT'],
  REFUNDED: [],
  PARTIALLY_REFUNDED: ['REFUNDED'],
};

export class OrderStateMachine {
  public static canTransition(from: OrderStatus, to: OrderStatus): boolean {
    if (from === to) return true;
    const allowed = ALLOWED_TRANSITIONS[from];
    return allowed ? allowed.includes(to) : false;
  }

  public static transition(from: OrderStatus, to: OrderStatus): OrderStatus {
    if (!this.canTransition(from, to)) {
      throw new Error(`Invalid order status transition from ${from} to ${to}`);
    }
    return to;
  }
}

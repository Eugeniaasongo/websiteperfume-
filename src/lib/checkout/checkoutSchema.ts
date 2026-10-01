import { z } from 'zod';

export const phoneGhanaRegex = /^(\+233|0)[235][0-9]{8}$/;

export const CheckoutInputSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email required'),
  customerPhone: z.string().refine((val) => phoneGhanaRegex.test(val.replace(/\s+/g, '')), {
    message: 'Valid Ghana phone required (e.g. 0241234567 or +233241234567)',
  }),
  region: z.string().min(2, 'Region is required'),
  city: z.string().min(2, 'City / Town is required'),
  landmark: z.string().optional(),
  ghanaPostGps: z.string().optional(),
  paymentMethod: z.enum(['PAYSTACK', 'COD']),
  couponCode: z.string().optional(),
  idempotencyKey: z.string().min(5, 'Idempotency key required'),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'At least one item required in cart'),
});

export type CheckoutInput = z.infer<typeof CheckoutInputSchema>;

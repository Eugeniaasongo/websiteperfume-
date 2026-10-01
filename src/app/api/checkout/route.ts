import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CheckoutInputSchema } from '@/lib/checkout/checkoutSchema';
import { PaystackProvider, CODProvider } from '@/lib/payments/paymentProvider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = CheckoutInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid checkout parameters', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    const existingOrder = await db.order.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
    });
    if (existingOrder) {
      return NextResponse.json({
        orderNumber: existingOrder.orderNumber,
        total: existingOrder.total,
        paymentMethod: existingOrder.paymentMethod,
        message: 'Order already processed (Idempotent replay)',
      });
    }

    let subtotal = 0;
    const orderItemsToCreate: {
      productId: string;
      variantId: string;
      quantity: number;
      unitPrice: number;
      totalAmount: number;
    }[] = [];

    for (const item of input.items) {
      const variant = await db.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || !variant.product.isPublished) {
        return NextResponse.json(
          { error: `Variant ID ${item.variantId} not found or unavailable.` },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.name} (${variant.size}). Only ${variant.stock} available.` },
          { status: 400 }
        );
      }

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItemsToCreate.push({
        productId: variant.productId,
        variantId: variant.id,
        quantity: item.quantity,
        unitPrice: variant.price,
        totalAmount: itemTotal,
      });
    }

    let discountTotal = 0;
    if (input.couponCode) {
      const discount = await db.discount.findFirst({
        where: { code: input.couponCode.toUpperCase(), isActive: true },
      });
      if (discount && subtotal >= discount.minOrderVal) {
        if (discount.type === 'PERCENTAGE') {
          discountTotal = (subtotal * discount.value) / 100;
        } else {
          discountTotal = discount.value;
        }
      }
    }

    const deliveryZone = await db.deliveryZone.findFirst({
      where: { regions: { contains: input.region } },
    });

    let deliveryFee = deliveryZone ? deliveryZone.fee : 50;
    if (deliveryZone?.minOrderForFree && subtotal >= deliveryZone.minOrderForFree) {
      deliveryFee = 0;
    }

    let codFee = 0;
    if (input.paymentMethod === 'COD') {
      if (deliveryZone && !deliveryZone.codAllowed) {
        return NextResponse.json(
          { error: `Cash on Delivery is not available for ${input.region} region.` },
          { status: 400 }
        );
      }
      if (deliveryZone?.maxCodValue && subtotal > deliveryZone.maxCodValue) {
        return NextResponse.json(
          { error: `Order amount exceeds COD limit of GHS ${deliveryZone.maxCodValue} for this zone.` },
          { status: 400 }
        );
      }
      codFee = 15;
    }

    const total = Math.max(0, subtotal - discountTotal + deliveryFee + codFee);
    const orderNumber = `VAL-${Math.floor(100000 + Math.random() * 900000)}`;
    const stockReservedUntil = new Date(Date.now() + 20 * 60 * 1000);

    const order = await db.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          idempotencyKey: input.idempotencyKey,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          region: input.region,
          city: input.city,
          landmark: input.landmark || null,
          ghanaPostGps: input.ghanaPostGps || null,
          status: input.paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING_PAYMENT',
          paymentMethod: input.paymentMethod,
          subtotal,
          discountTotal,
          deliveryFee,
          codFee,
          total,
          stockReservedUntil,
          items: { create: orderItemsToCreate },
        },
      });

      for (const item of input.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    const callbackUrl = `${req.nextUrl.origin}/order-confirmation?orderNumber=${order.orderNumber}`;
    let paymentResult;

    if (input.paymentMethod === 'PAYSTACK') {
      const provider = new PaystackProvider();
      paymentResult = await provider.initializePayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        callbackUrl,
      });
    } else {
      const provider = new CODProvider();
      paymentResult = await provider.initializePayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        callbackUrl,
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentUrl: paymentResult.paymentUrl,
      transactionRef: paymentResult.transactionRef,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Server error during checkout' }, { status: 500 });
  }
}

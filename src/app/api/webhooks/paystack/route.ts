import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PaystackProvider } from '@/lib/payments/paymentProvider';
import { OrderStateMachine } from '@/lib/orders/orderStateMachine';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';

    const paystack = new PaystackProvider();

    const isValid = paystack.verifyWebhookSignature(signature, rawBody);
    if (!isValid && !process.env.PAYSTACK_SECRET_KEY?.includes('placeholder')) {
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.data?.id?.toString() || payload.event + '-' + Date.now();
    const eventType = payload.event;

    const existingWebhook = await db.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingWebhook && existingWebhook.processed) {
      return NextResponse.json({ message: 'Webhook event already processed (Idempotent)' }, { status: 200 });
    }

    await db.webhookEvent.upsert({
      where: { eventId },
      create: {
        eventId,
        provider: 'paystack',
        eventType,
        payload: rawBody,
        processed: false,
      },
      update: {},
    });

    if (eventType === 'charge.success') {
      const data = payload.data;
      const orderNumber = data.metadata?.order_number;
      const transactionRef = data.reference;
      const amount = data.amount / 100;

      if (orderNumber) {
        const order = await db.order.findUnique({ where: { orderNumber } });

        if (order) {
          const newStatus = OrderStateMachine.transition(order.status as any, 'PAID');

          await db.$transaction([
            db.order.update({
              where: { id: order.id },
              data: {
                status: newStatus,
                updatedAt: new Date(),
              },
            }),
            db.payment.upsert({
              where: { transactionRef },
              create: {
                transactionRef,
                paymentMethod: 'PAYSTACK',
                status: 'SUCCESS',
                amount,
                gatewayResponse: data.gateway_response || 'Successful',
                paidAt: new Date(data.paid_at || Date.now()),
                orderId: order.id,
              },
              update: {
                status: 'SUCCESS',
                paidAt: new Date(data.paid_at || Date.now()),
              },
            }),
          ]);
        }
      }
    }

    await db.webhookEvent.update({
      where: { eventId },
      data: { processed: true, processedAt: new Date() },
    });

    return NextResponse.json({ success: true, eventId });
  } catch (err: any) {
    console.error('Paystack webhook processing error:', err);
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}

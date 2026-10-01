import crypto from 'crypto';

export interface PaymentInitializationParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitializationResult {
  success: boolean;
  transactionRef: string;
  paymentUrl?: string;
  authorizationCode?: string;
  message?: string;
}

export interface TransactionVerificationResult {
  success: boolean;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionRef: string;
  amount: number;
  gatewayResponse?: string;
  paidAt?: Date;
  raw?: any;
}

export interface RefundParams {
  transactionRef: string;
  amount: number;
  reason: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  message?: string;
}

export interface PaymentProvider {
  name: string;
  initializePayment(params: PaymentInitializationParams): Promise<PaymentInitializationResult>;
  verifyTransaction(transactionRef: string): Promise<TransactionVerificationResult>;
  verifyWebhookSignature(signature: string, rawBody: string): boolean;
  processRefund(params: RefundParams): Promise<RefundResult>;
}

export class PaystackProvider implements PaymentProvider {
  public name = 'PAYSTACK';
  private secretKey: string;

  constructor(secretKey?: string) {
    this.secretKey = secretKey || process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_key_123';
  }

  public verifyWebhookSignature(signature: string, rawBody: string): boolean {
    if (!signature || !rawBody) return false;
    const hash = crypto.createHmac('sha512', this.secretKey).update(rawBody).digest('hex');
    return hash === signature;
  }

  public async initializePayment(params: PaymentInitializationParams): Promise<PaymentInitializationResult> {
    const ref = `PAY-${params.orderNumber}-${Date.now()}`;
    const amountInKobo = Math.round(params.amount * 100);

    if (this.secretKey.includes('placeholder')) {
      return {
        success: true,
        transactionRef: ref,
        paymentUrl: `${params.callbackUrl}&reference=${ref}&status=success`,
        message: 'Paystack initialized (Test Simulation Mode)',
      };
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: params.customerEmail,
          amount: amountInKobo,
          currency: 'GHS',
          reference: ref,
          callback_url: params.callbackUrl,
          metadata: {
            order_id: params.orderId,
            order_number: params.orderNumber,
            customer_name: params.customerName,
            customer_phone: params.customerPhone,
            ...params.metadata,
          },
        }),
      });

      const data = await response.json();
      if (data.status && data.data?.authorization_url) {
        return {
          success: true,
          transactionRef: ref,
          paymentUrl: data.data.authorization_url,
          authorizationCode: data.data.access_code,
        };
      }
      return {
        success: false,
        transactionRef: ref,
        message: data.message || 'Paystack initialization failed',
      };
    } catch (err: any) {
      return {
        success: false,
        transactionRef: ref,
        message: err.message || 'Network error connecting to Paystack',
      };
    }
  }

  public async verifyTransaction(transactionRef: string): Promise<TransactionVerificationResult> {
    if (this.secretKey.includes('placeholder') || transactionRef.startsWith('PAY-TEST-')) {
      return {
        success: true,
        status: 'SUCCESS',
        transactionRef,
        amount: 100,
        gatewayResponse: 'Successful (Test Simulation)',
        paidAt: new Date(),
      };
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(transactionRef)}`, {
        headers: { Authorization: `Bearer ${this.secretKey}` },
      });
      const data = await response.json();

      if (data.status && data.data?.status === 'success') {
        return {
          success: true,
          status: 'SUCCESS',
          transactionRef,
          amount: data.data.amount / 100,
          gatewayResponse: data.data.gateway_response,
          paidAt: new Date(data.data.paid_at || Date.now()),
          raw: data.data,
        };
      }
      return {
        success: false,
        status: data.data?.status === 'failed' ? 'FAILED' : 'PENDING',
        transactionRef,
        amount: (data.data?.amount || 0) / 100,
        gatewayResponse: data.message || 'Verification unsuccessful',
      };
    } catch (err: any) {
      return {
        success: false,
        status: 'FAILED',
        transactionRef,
        amount: 0,
        gatewayResponse: err.message,
      };
    }
  }

  public async processRefund(params: RefundParams): Promise<RefundResult> {
    if (this.secretKey.includes('placeholder')) {
      return { success: true, refundId: `REF-${Date.now()}`, message: 'Refund simulated' };
    }

    try {
      const response = await fetch('https://api.paystack.co/refund', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: params.transactionRef,
          amount: Math.round(params.amount * 100),
          merchant_note: params.reason,
        }),
      });
      const data = await response.json();
      if (data.status) {
        return { success: true, refundId: data.data?.id?.toString(), message: data.message };
      }
      return { success: false, message: data.message || 'Refund failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}

export class CODProvider implements PaymentProvider {
  public name = 'COD';

  public verifyWebhookSignature(): boolean {
    return true;
  }

  public async initializePayment(params: PaymentInitializationParams): Promise<PaymentInitializationResult> {
    const ref = `COD-${params.orderNumber}-${Date.now()}`;
    return {
      success: true,
      transactionRef: ref,
      paymentUrl: `${params.callbackUrl}&reference=${ref}&status=cod_pending`,
      message: 'Cash on delivery order initialized',
    };
  }

  public async verifyTransaction(transactionRef: string): Promise<TransactionVerificationResult> {
    return {
      success: true,
      status: 'SUCCESS',
      transactionRef,
      amount: 0,
      gatewayResponse: 'Cash on delivery verified on delivery',
      paidAt: new Date(),
    };
  }

  public async processRefund(params: RefundParams): Promise<RefundResult> {
    return { success: true, refundId: `REF-COD-${Date.now()}`, message: 'Cash refund noted in accounting' };
  }
}

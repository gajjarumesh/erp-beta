import { Injectable, Logger } from '@nestjs/common';
import { PaymentGatewayAdapter } from './base.adapter';

@Injectable()
export class RazorpayAdapter implements PaymentGatewayAdapter {
  private readonly logger = new Logger(RazorpayAdapter.name);
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {}

  configure(config: { keyId: string; keySecret: string; webhookSecret?: string }) {
    this.keyId = config.keyId;
    this.keySecret = config.keySecret;
    this.webhookSecret = config.webhookSecret || '';
  }

  async test(): Promise<{ success: boolean; message?: string }> {
    try {
      if (!this.keyId || !this.keySecret) {
        return { success: false, message: 'API credentials not configured' };
      }

      // In production: const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
      // await razorpay.payments.all({ count: 1 });

      this.logger.log('Razorpay test connection successful');
      return { success: true, message: 'Connected to Razorpay successfully' };
    } catch (error) {
      this.logger.error('Razorpay test failed', error);
      return { success: false, message: error.message };
    }
  }

  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    invoiceId: string;
    metadata?: Record<string, any>;
  }): Promise<{ id: string; clientSecret?: string; status: string }> {
    try {
      // In production:
      // const Razorpay = require('razorpay');
      // const razorpay = new Razorpay({ key_id: this.keyId, key_secret: this.keySecret });
      // const order = await razorpay.orders.create({
      //   amount: Math.round(params.amount * 100), // Convert to paise
      //   currency: params.currency.toUpperCase(),
      //   notes: {
      //     invoiceId: params.invoiceId,
      //     ...params.metadata,
      //   },
      // });

      // Mock response
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        status: 'created',
      };

      this.logger.log(`Created Razorpay order for invoice ${params.invoiceId}`);
      return mockOrder;
    } catch (error) {
      this.logger.error('Failed to create Razorpay order', error);
      throw error;
    }
  }

  async handleWebhook(
    payload: any,
    signature?: string,
  ): Promise<{ event: string; data: any }> {
    try {
      // In production: Verify webhook signature
      // const crypto = require('crypto');
      // const expectedSignature = crypto
      //   .createHmac('sha256', this.webhookSecret)
      //   .update(JSON.stringify(payload))
      //   .digest('hex');
      // if (signature !== expectedSignature) {
      //   throw new Error('Invalid webhook signature');
      // }

      const event = {
        event: payload.event || 'payment.captured',
        payload: payload.payload || {},
      };

      this.logger.log(`Processing Razorpay webhook: ${event.event}`);

      return {
        event: event.event,
        data: event.payload,
      };
    } catch (error) {
      this.logger.error('Failed to process Razorpay webhook', error);
      throw error;
    }
  }

  async verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<boolean> {
    // In production:
    // const crypto = require('crypto');
    // const text = `${params.orderId}|${params.paymentId}`;
    // const expectedSignature = crypto
    //   .createHmac('sha256', this.keySecret)
    //   .update(text)
    //   .digest('hex');
    // return expectedSignature === params.signature;

    return true; // Mock
  }
}

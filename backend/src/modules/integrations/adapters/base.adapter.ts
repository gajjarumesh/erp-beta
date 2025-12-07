export interface IntegrationAdapter {
  configure(config: any): void;
  test(): Promise<{ success: boolean; message?: string }>;
}

export interface PaymentGatewayAdapter extends IntegrationAdapter {
  createPaymentIntent(params: {
    amount: number;
    currency: string;
    invoiceId: string;
    metadata?: Record<string, any>;
  }): Promise<{
    id: string;
    clientSecret?: string;
    status: string;
  }>;

  handleWebhook(payload: any, signature?: string): Promise<{
    event: string;
    data: any;
  }>;
}

export interface EmailProviderAdapter extends IntegrationAdapter {
  sendEmail(params: {
    to: string | string[];
    from: string;
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<{
      filename: string;
      content: string | Buffer;
    }>;
  }): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
  }>;
}

export interface SmsProviderAdapter extends IntegrationAdapter {
  sendSms(params: {
    to: string;
    from: string;
    body: string;
  }): Promise<{
    messageId: string;
    status: string;
  }>;
}

export interface EcommerceAdapter extends IntegrationAdapter {
  syncProducts(lastSyncTime?: Date): Promise<{
    count: number;
    products: any[];
  }>;

  syncOrders(lastSyncTime?: Date): Promise<{
    count: number;
    orders: any[];
  }>;
}

export interface DocumentSigningAdapter extends IntegrationAdapter {
  sendDocument(params: {
    documentUrl: string;
    signers: Array<{
      email: string;
      name: string;
    }>;
    metadata?: Record<string, any>;
  }): Promise<{
    envelopeId: string;
    status: string;
  }>;

  handleWebhook(payload: any): Promise<{
    event: string;
    envelopeId: string;
    status: string;
  }>;
}

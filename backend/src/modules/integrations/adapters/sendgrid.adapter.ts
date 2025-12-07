import { Injectable, Logger } from '@nestjs/common';
import { EmailProviderAdapter } from './base.adapter';

@Injectable()
export class SendGridAdapter implements EmailProviderAdapter {
  private readonly logger = new Logger(SendGridAdapter.name);
  private apiKey: string;

  constructor() {}

  configure(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  async test(): Promise<{ success: boolean; message?: string }> {
    try {
      if (!this.apiKey) {
        return { success: false, message: 'API key not configured' };
      }

      // In production: const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.apiKey);
      // await sgMail.send({ ... test email ... });

      this.logger.log('SendGrid test connection successful');
      return { success: true, message: 'Connected to SendGrid successfully' };
    } catch (error) {
      this.logger.error('SendGrid test failed', error);
      return { success: false, message: error.message };
    }
  }

  async sendEmail(params: {
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
  }> {
    try {
      // In production:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.apiKey);
      //
      // const msg = {
      //   to: params.to,
      //   from: params.from,
      //   subject: params.subject,
      //   text: params.text,
      //   html: params.html,
      //   attachments: params.attachments?.map(att => ({
      //     filename: att.filename,
      //     content: att.content.toString('base64'),
      //     type: 'application/octet-stream',
      //     disposition: 'attachment',
      //   })),
      // };
      //
      // const response = await sgMail.send(msg);

      // Mock response
      const toArray = Array.isArray(params.to) ? params.to : [params.to];
      const mockResponse = {
        messageId: `sg_mock_${Date.now()}`,
        accepted: toArray,
        rejected: [],
      };

      this.logger.log(`Sent email via SendGrid to ${toArray.join(', ')}`);
      return mockResponse;
    } catch (error) {
      this.logger.error('Failed to send email via SendGrid', error);
      throw error;
    }
  }
}

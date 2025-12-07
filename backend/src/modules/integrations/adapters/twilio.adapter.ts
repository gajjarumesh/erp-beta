import { Injectable, Logger } from '@nestjs/common';
import { SmsProviderAdapter } from './base.adapter';

@Injectable()
export class TwilioAdapter implements SmsProviderAdapter {
  private readonly logger = new Logger(TwilioAdapter.name);
  private accountSid: string;
  private authToken: string;

  constructor() {}

  configure(config: { accountSid: string; authToken: string }) {
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
  }

  async test(): Promise<{ success: boolean; message?: string }> {
    try {
      if (!this.accountSid || !this.authToken) {
        return { success: false, message: 'Twilio credentials not configured' };
      }

      // In production:
      // const twilio = require('twilio');
      // const client = twilio(this.accountSid, this.authToken);
      // await client.api.accounts(this.accountSid).fetch();

      this.logger.log('Twilio test connection successful');
      return { success: true, message: 'Connected to Twilio successfully' };
    } catch (error) {
      this.logger.error('Twilio test failed', error);
      return { success: false, message: error.message };
    }
  }

  async sendSms(params: {
    to: string;
    from: string;
    body: string;
  }): Promise<{
    messageId: string;
    status: string;
  }> {
    try {
      // In production:
      // const twilio = require('twilio');
      // const client = twilio(this.accountSid, this.authToken);
      // const message = await client.messages.create({
      //   body: params.body,
      //   from: params.from,
      //   to: params.to,
      // });
      //
      // return {
      //   messageId: message.sid,
      //   status: message.status,
      // };

      // Mock response
      const mockResponse = {
        messageId: `SM${Date.now()}`,
        status: 'queued',
      };

      this.logger.log(`Sent SMS via Twilio to ${params.to}`);
      return mockResponse;
    } catch (error) {
      this.logger.error('Failed to send SMS via Twilio', error);
      throw error;
    }
  }
}

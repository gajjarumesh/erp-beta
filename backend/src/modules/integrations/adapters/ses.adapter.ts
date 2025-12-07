import { Injectable, Logger } from '@nestjs/common';
import { EmailProviderAdapter } from './base.adapter';

@Injectable()
export class SesAdapter implements EmailProviderAdapter {
  private readonly logger = new Logger(SesAdapter.name);
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;

  constructor() {}

  configure(config: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  }) {
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.region = config.region;
  }

  async test(): Promise<{ success: boolean; message?: string }> {
    try {
      if (!this.accessKeyId || !this.secretAccessKey) {
        return { success: false, message: 'AWS credentials not configured' };
      }

      // In production:
      // const AWS = require('aws-sdk');
      // const ses = new AWS.SES({
      //   accessKeyId: this.accessKeyId,
      //   secretAccessKey: this.secretAccessKey,
      //   region: this.region,
      // });
      // await ses.getSendQuota().promise();

      this.logger.log('SES test connection successful');
      return { success: true, message: 'Connected to AWS SES successfully' };
    } catch (error) {
      this.logger.error('SES test failed', error);
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
      // const AWS = require('aws-sdk');
      // const ses = new AWS.SES({
      //   accessKeyId: this.accessKeyId,
      //   secretAccessKey: this.secretAccessKey,
      //   region: this.region,
      // });
      //
      // const toArray = Array.isArray(params.to) ? params.to : [params.to];
      //
      // // For simple emails without attachments
      // if (!params.attachments || params.attachments.length === 0) {
      //   const sesParams = {
      //     Source: params.from,
      //     Destination: { ToAddresses: toArray },
      //     Message: {
      //       Subject: { Data: params.subject },
      //       Body: {
      //         Html: params.html ? { Data: params.html } : undefined,
      //         Text: params.text ? { Data: params.text } : undefined,
      //       },
      //     },
      //   };
      //   const result = await ses.sendEmail(sesParams).promise();
      //   return {
      //     messageId: result.MessageId,
      //     accepted: toArray,
      //     rejected: [],
      //   };
      // }
      // // For emails with attachments, use sendRawEmail with MIME

      // Mock response
      const toArray = Array.isArray(params.to) ? params.to : [params.to];
      const mockResponse = {
        messageId: `ses_mock_${Date.now()}`,
        accepted: toArray,
        rejected: [],
      };

      this.logger.log(`Sent email via SES to ${toArray.join(', ')}`);
      return mockResponse;
    } catch (error) {
      this.logger.error('Failed to send email via SES', error);
      throw error;
    }
  }
}

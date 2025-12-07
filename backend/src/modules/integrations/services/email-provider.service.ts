import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration, IntegrationType, Settings } from '../../../database/entities';
import { SendGridAdapter, SesAdapter } from '../adapters';

@Injectable()
export class EmailProviderService {
  private readonly logger = new Logger(EmailProviderService.name);

  constructor(
    @InjectRepository(Integration)
    private integrationsRepository: Repository<Integration>,
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
    private sendGridAdapter: SendGridAdapter,
    private sesAdapter: SesAdapter,
  ) {}

  async sendEmail(
    tenantId: string,
    params: {
      to: string | string[];
      from: string;
      subject: string;
      html?: string;
      text?: string;
      attachments?: Array<{
        filename: string;
        content: string | Buffer;
      }>;
    },
  ): Promise<{
    messageId: string;
    accepted: string[];
    rejected: string[];
  }> {
    // Get email provider from settings
    const setting = await this.settingsRepository.findOne({
      where: {
        tenantId,
        key: 'notifications.email.provider',
      },
    });

    const providerValue = setting?.value || 'sendgrid';
    const provider: string = typeof providerValue === 'string' ? providerValue : 'sendgrid';

    // Get integration config
    const integrationType =
      (provider as string) === 'ses' ? IntegrationType.SES : IntegrationType.SENDGRID;

    const integration = await this.integrationsRepository.findOne({
      where: { tenantId, type: integrationType },
    });

    if (!integration) {
      throw new Error(`Email provider ${provider} not configured`);
    }

    // Use appropriate adapter
    if ((provider as string) === 'ses') {
      this.sesAdapter.configure(integration.config as any);
      return await this.sesAdapter.sendEmail(params);
    } else {
      this.sendGridAdapter.configure(integration.config as any);
      return await this.sendGridAdapter.sendEmail(params);
    }
  }

  async testEmailProvider(
    tenantId: string,
    provider: 'sendgrid' | 'ses',
  ): Promise<{ success: boolean; message?: string }> {
    const integrationType =
      provider === 'ses' ? IntegrationType.SES : IntegrationType.SENDGRID;

    const integration = await this.integrationsRepository.findOne({
      where: { tenantId, type: integrationType },
    });

    if (!integration) {
      return {
        success: false,
        message: `${provider} integration not configured`,
      };
    }

    if (provider === 'ses') {
      this.sesAdapter.configure(integration.config as any);
      return await this.sesAdapter.test();
    } else {
      this.sendGridAdapter.configure(integration.config as any);
      return await this.sendGridAdapter.test();
    }
  }
}

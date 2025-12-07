import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration, IntegrationStatus, IntegrationType } from '../../../database/entities';
import { IntegrationAdapter } from '../adapters/base.adapter';
import {
  StripeAdapter,
  RazorpayAdapter,
  SendGridAdapter,
  SesAdapter,
  TwilioAdapter,
  ShopifyAdapter,
  DocuSignAdapter,
} from '../adapters';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto/integration.dto';

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);

  constructor(
    @InjectRepository(Integration)
    private integrationsRepository: Repository<Integration>,
    private stripeAdapter: StripeAdapter,
    private razorpayAdapter: RazorpayAdapter,
    private sendGridAdapter: SendGridAdapter,
    private sesAdapter: SesAdapter,
    private twilioAdapter: TwilioAdapter,
    private shopifyAdapter: ShopifyAdapter,
    private docuSignAdapter: DocuSignAdapter,
  ) {}

  async create(
    tenantId: string,
    createDto: CreateIntegrationDto,
  ): Promise<Integration> {
    const integration = this.integrationsRepository.create({
      tenantId,
      ...createDto,
    });

    return await this.integrationsRepository.save(integration);
  }

  async findAll(tenantId: string): Promise<Integration[]> {
    return await this.integrationsRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Integration> {
    const integration = await this.integrationsRepository.findOne({
      where: { id, tenantId },
    });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }

  async update(
    tenantId: string,
    id: string,
    updateDto: UpdateIntegrationDto,
  ): Promise<Integration> {
    const integration = await this.findOne(tenantId, id);
    
    Object.assign(integration, updateDto);
    
    return await this.integrationsRepository.save(integration);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const integration = await this.findOne(tenantId, id);
    await this.integrationsRepository.remove(integration);
  }

  async test(tenantId: string, id: string): Promise<{ success: boolean; message?: string }> {
    const integration = await this.findOne(tenantId, id);

    try {
      const adapter = this.getAdapter(integration.type);
      adapter.configure(integration.config);

      const result = await adapter.test();

      // Update status and last tested time
      integration.status = result.success
        ? IntegrationStatus.ACTIVE
        : IntegrationStatus.ERROR;
      integration.lastTestedAt = new Date();
      await this.integrationsRepository.save(integration);

      return result;
    } catch (error) {
      this.logger.error(`Failed to test integration ${id}`, error);
      
      integration.status = IntegrationStatus.ERROR;
      integration.lastTestedAt = new Date();
      await this.integrationsRepository.save(integration);

      return {
        success: false,
        message: error.message,
      };
    }
  }

  getAdapter(type: IntegrationType): IntegrationAdapter {
    switch (type) {
      case IntegrationType.STRIPE:
        return this.stripeAdapter;
      case IntegrationType.RAZORPAY:
        return this.razorpayAdapter;
      case IntegrationType.SENDGRID:
        return this.sendGridAdapter;
      case IntegrationType.SES:
        return this.sesAdapter;
      case IntegrationType.TWILIO:
        return this.twilioAdapter;
      case IntegrationType.SHOPIFY:
        return this.shopifyAdapter;
      case IntegrationType.DOCUSIGN:
        return this.docuSignAdapter;
      default:
        throw new Error(`Unknown integration type: ${type}`);
    }
  }

  async getIntegrationByType(
    tenantId: string,
    type: IntegrationType,
  ): Promise<Integration | null> {
    return await this.integrationsRepository.findOne({
      where: { tenantId, type, status: IntegrationStatus.ACTIVE },
    });
  }
}

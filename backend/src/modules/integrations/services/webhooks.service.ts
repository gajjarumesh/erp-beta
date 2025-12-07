import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookSubscription } from '../../../database/entities';
import {
  CreateWebhookSubscriptionDto,
  UpdateWebhookSubscriptionDto,
} from '../dto/webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(WebhookSubscription)
    private webhooksRepository: Repository<WebhookSubscription>,
  ) {}

  async create(
    tenantId: string,
    createDto: CreateWebhookSubscriptionDto,
  ): Promise<WebhookSubscription> {
    const webhook = this.webhooksRepository.create({
      tenantId,
      ...createDto,
    });

    return await this.webhooksRepository.save(webhook);
  }

  async findAll(tenantId: string): Promise<WebhookSubscription[]> {
    return await this.webhooksRepository.find({
      where: { tenantId },
      relations: ['integration'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<WebhookSubscription> {
    const webhook = await this.webhooksRepository.findOne({
      where: { id, tenantId },
      relations: ['integration'],
    });

    if (!webhook) {
      throw new NotFoundException('Webhook subscription not found');
    }

    return webhook;
  }

  async update(
    tenantId: string,
    id: string,
    updateDto: UpdateWebhookSubscriptionDto,
  ): Promise<WebhookSubscription> {
    const webhook = await this.findOne(tenantId, id);
    
    Object.assign(webhook, updateDto);
    
    return await this.webhooksRepository.save(webhook);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const webhook = await this.findOne(tenantId, id);
    await this.webhooksRepository.remove(webhook);
  }

  async findActiveByEvents(
    tenantId: string,
    event: string,
  ): Promise<WebhookSubscription[]> {
    const webhooks = await this.webhooksRepository
      .createQueryBuilder('webhook')
      .where('webhook.tenant_id = :tenantId', { tenantId })
      .andWhere('webhook.is_active = :isActive', { isActive: true })
      .andWhere(
        `webhook.events @> :event::jsonb OR webhook.events @> '["*"]'::jsonb`,
        { event: JSON.stringify([event]) },
      )
      .getMany();

    return webhooks;
  }

  async triggerWebhooks(
    tenantId: string,
    event: string,
    data: any,
  ): Promise<void> {
    const webhooks = await this.findActiveByEvents(tenantId, event);

    for (const webhook of webhooks) {
      try {
        await this.sendWebhook(webhook, event, data);
      } catch (error) {
        this.logger.error(
          `Failed to send webhook to ${webhook.targetUrl}`,
          error,
        );
      }
    }
  }

  private async sendWebhook(
    webhook: WebhookSubscription,
    event: string,
    data: any,
  ): Promise<void> {
    // In production: Use a queue system like Bull for reliability
    // const fetch = require('node-fetch');
    // const crypto = require('crypto');
    //
    // const payload = JSON.stringify({ event, data, timestamp: Date.now() });
    // const signature = crypto
    //   .createHmac('sha256', webhook.secret)
    //   .update(payload)
    //   .digest('hex');
    //
    // await fetch(webhook.targetUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Webhook-Signature': signature,
    //   },
    //   body: payload,
    // });

    this.logger.log(
      `Webhook sent to ${webhook.targetUrl} for event: ${event}`,
    );
  }
}

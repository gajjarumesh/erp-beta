import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { IntegrationsService } from './services/integrations.service';
import { WebhooksService } from './services/webhooks.service';
import { EmailProviderService } from './services/email-provider.service';
import { ShopifyAdapter } from './adapters/shopify.adapter';
import {
  CreateIntegrationDto,
  UpdateIntegrationDto,
} from './dto/integration.dto';
import {
  CreateWebhookSubscriptionDto,
  UpdateWebhookSubscriptionDto,
} from './dto/webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integration, IntegrationType } from '../../database/entities';

@ApiTags('integrations')
@ApiBearerAuth()
@Controller('integrations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IntegrationsController {
  constructor(
    private integrationsService: IntegrationsService,
    private webhooksService: WebhooksService,
    private emailProviderService: EmailProviderService,
    private shopifyAdapter: ShopifyAdapter,
    @InjectRepository(Integration)
    private integrationsRepository: Repository<Integration>,
  ) {}

  // Integrations CRUD
  @Post()
  @Permissions('integrations:create')
  @ApiOperation({ summary: 'Create new integration' })
  async createIntegration(@Request() req: any, @Body() createDto: CreateIntegrationDto) {
    return await this.integrationsService.create(req.user.tenantId, createDto);
  }

  @Get()
  @Permissions('integrations:read')
  @ApiOperation({ summary: 'List all integrations' })
  async getIntegrations(@Request() req: any) {
    return await this.integrationsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @Permissions('integrations:read')
  @ApiOperation({ summary: 'Get integration by ID' })
  async getIntegration(@Request() req: any, @Param('id') id: string) {
    return await this.integrationsService.findOne(req.user.tenantId, id);
  }

  @Put(':id')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Update integration' })
  async updateIntegration(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateIntegrationDto,
  ) {
    return await this.integrationsService.update(
      req.user.tenantId,
      id,
      updateDto,
    );
  }

  @Delete(':id')
  @Permissions('integrations:delete')
  @ApiOperation({ summary: 'Delete integration' })
  async deleteIntegration(@Request() req: any, @Param('id') id: string) {
    await this.integrationsService.remove(req.user.tenantId, id);
    return { message: 'Integration deleted successfully' };
  }

  @Post(':id/test')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Test integration connectivity' })
  async testIntegration(@Request() req: any, @Param('id') id: string) {
    return await this.integrationsService.test(req.user.tenantId, id);
  }

  // Email Provider
  @Post('email/test')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Test email provider' })
  async testEmailProvider(
    @Request() req: any,
    @Body() body: { provider: 'sendgrid' | 'ses' },
  ) {
    return await this.emailProviderService.testEmailProvider(
      req.user.tenantId,
      body.provider,
    );
  }

  // Shopify Sync
  @Post('shopify/sync-products')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Sync products from Shopify' })
  async syncShopifyProducts(@Request() req: any) {
    const integration = await this.integrationsRepository.findOne({
      where: {
        tenantId: req.user.tenantId,
        type: IntegrationType.SHOPIFY,
      },
    });

    if (!integration) {
      return { success: false, message: 'Shopify integration not configured' };
    }

    this.shopifyAdapter.configure(integration.config as any);
    const result = await this.shopifyAdapter.syncProducts();

    return {
      success: true,
      ...result,
    };
  }

  @Post('shopify/sync-orders')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Sync orders from Shopify' })
  async syncShopifyOrders(@Request() req: any) {
    const integration = await this.integrationsRepository.findOne({
      where: {
        tenantId: req.user.tenantId,
        type: IntegrationType.SHOPIFY,
      },
    });

    if (!integration) {
      return { success: false, message: 'Shopify integration not configured' };
    }

    this.shopifyAdapter.configure(integration.config as any);
    const result = await this.shopifyAdapter.syncOrders();

    return {
      success: true,
      ...result,
    };
  }

  // Webhooks CRUD
  @Post('webhooks')
  @Permissions('integrations:create')
  @ApiOperation({ summary: 'Create webhook subscription' })
  async createWebhook(@Request() req: any, @Body() createDto: CreateWebhookSubscriptionDto) {
    return await this.webhooksService.create(req.user.tenantId, createDto);
  }

  @Get('webhooks')
  @Permissions('integrations:read')
  @ApiOperation({ summary: 'List webhook subscriptions' })
  async getWebhooks(@Request() req: any) {
    return await this.webhooksService.findAll(req.user.tenantId);
  }

  @Get('webhooks/:id')
  @Permissions('integrations:read')
  @ApiOperation({ summary: 'Get webhook subscription by ID' })
  async getWebhook(@Request() req: any, @Param('id') id: string) {
    return await this.webhooksService.findOne(req.user.tenantId, id);
  }

  @Put('webhooks/:id')
  @Permissions('integrations:update')
  @ApiOperation({ summary: 'Update webhook subscription' })
  async updateWebhook(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateWebhookSubscriptionDto,
  ) {
    return await this.webhooksService.update(req.user.tenantId, id, updateDto);
  }

  @Delete('webhooks/:id')
  @Permissions('integrations:delete')
  @ApiOperation({ summary: 'Delete webhook subscription' })
  async deleteWebhook(@Request() req: any, @Param('id') id: string) {
    await this.webhooksService.remove(req.user.tenantId, id);
    return { message: 'Webhook subscription deleted successfully' };
  }
}

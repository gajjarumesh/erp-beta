import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Integration,
  WebhookSubscription,
  Settings,
} from '../../database/entities';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './services/integrations.service';
import { WebhooksService } from './services/webhooks.service';
import { EmailProviderService } from './services/email-provider.service';
import {
  StripeAdapter,
  RazorpayAdapter,
  SendGridAdapter,
  SesAdapter,
  TwilioAdapter,
  ShopifyAdapter,
  DocuSignAdapter,
} from './adapters';

@Module({
  imports: [
    TypeOrmModule.forFeature([Integration, WebhookSubscription, Settings]),
  ],
  controllers: [IntegrationsController],
  providers: [
    IntegrationsService,
    WebhooksService,
    EmailProviderService,
    StripeAdapter,
    RazorpayAdapter,
    SendGridAdapter,
    SesAdapter,
    TwilioAdapter,
    ShopifyAdapter,
    DocuSignAdapter,
  ],
  exports: [
    IntegrationsService,
    WebhooksService,
    EmailProviderService,
    StripeAdapter,
    RazorpayAdapter,
    SendGridAdapter,
    SesAdapter,
    TwilioAdapter,
    ShopifyAdapter,
    DocuSignAdapter,
  ],
})
export class IntegrationsModule {}

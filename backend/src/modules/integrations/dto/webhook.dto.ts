import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWebhookSubscriptionDto {
  @ApiProperty({ description: 'Integration ID', required: false })
  @IsString()
  @IsOptional()
  integrationId?: string;

  @ApiProperty({ description: 'Target webhook URL' })
  @IsUrl()
  @IsNotEmpty()
  targetUrl: string;

  @ApiProperty({
    description: 'Array of event types to subscribe to',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  events: string[];

  @ApiProperty({ description: 'Webhook secret for verification' })
  @IsString()
  @IsNotEmpty()
  secret: string;
}

export class UpdateWebhookSubscriptionDto {
  @ApiProperty({ description: 'Target webhook URL', required: false })
  @IsUrl()
  @IsOptional()
  targetUrl?: string;

  @ApiProperty({
    description: 'Array of event types to subscribe to',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  events?: string[];

  @ApiProperty({
    description: 'Is webhook active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

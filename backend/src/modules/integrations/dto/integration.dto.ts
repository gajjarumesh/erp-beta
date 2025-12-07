import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IntegrationType } from '../../../database/entities';

export class CreateIntegrationDto {
  @ApiProperty({
    enum: IntegrationType,
    description: 'Type of integration',
  })
  @IsEnum(IntegrationType)
  @IsNotEmpty()
  type: IntegrationType;

  @ApiProperty({ description: 'Name of the integration' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Configuration JSON for the integration',
    type: 'object',
  })
  @IsObject()
  config: Record<string, any>;
}

export class UpdateIntegrationDto {
  @ApiProperty({ description: 'Name of the integration', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Configuration JSON for the integration',
    type: 'object',
    required: false,
  })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}

export class TestIntegrationDto {
  @ApiProperty({ description: 'Integration ID to test' })
  @IsString()
  @IsNotEmpty()
  integrationId: string;
}

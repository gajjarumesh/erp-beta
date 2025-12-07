import { IsString, IsNumber, IsOptional, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductVariantDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ example: { size: 'medium', color: 'red' } })
  @IsObject()
  @IsOptional()
  variantAttributes?: Record<string, any>;

  @ApiProperty({ example: 'PRD-001-M-RED' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: 109.99 })
  @IsNumber()
  @IsOptional()
  priceOverride?: number;
}

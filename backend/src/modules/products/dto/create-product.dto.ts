import { IsString, IsNumber, IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'PRD-001' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 'Premium Widget' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'High-quality widget for professional use' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'unit' })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  basePrice: number;

  @ApiPropertyOptional({ example: 49.99 })
  @IsNumber()
  @IsOptional()
  costPrice?: number;

  @ApiPropertyOptional({ example: 'standard' })
  @IsString()
  @IsOptional()
  taxClass?: string;

  @ApiPropertyOptional({ example: { color: 'blue', size: 'large' } })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

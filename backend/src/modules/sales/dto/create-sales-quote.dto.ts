import { IsUUID, IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SalesQuoteStatus } from '../../../database/entities';

export class CreateSalesQuoteLineDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ example: 'Premium Widget - Blue' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  qty: number;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  unitPrice: number;

  @ApiPropertyOptional({ example: 5.00 })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({ example: 10.00 })
  @IsNumber()
  @IsOptional()
  taxRate?: number;
}

export class CreateSalesQuoteDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  contactId?: string;

  @ApiProperty({ example: 'Q-2024-0001' })
  @IsString()
  quoteNumber: string;

  @ApiPropertyOptional({ enum: SalesQuoteStatus })
  @IsEnum(SalesQuoteStatus)
  @IsOptional()
  status?: SalesQuoteStatus;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @ApiPropertyOptional({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: 'Payment terms: Net 30' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ type: [CreateSalesQuoteLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalesQuoteLineDto)
  lines: CreateSalesQuoteLineDto[];
}

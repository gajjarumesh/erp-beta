import {
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceType, InvoiceStatus } from '../../../database/entities';

export class InvoiceLineDto {
  @ApiPropertyOptional({ description: 'Product ID' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ example: 'Professional Services - December 2024' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: 10, minimum: 0 })
  @IsNumber()
  @Min(0)
  qty: number;

  @ApiProperty({ example: 100.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 10.00, minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({ example: 50.00, minimum: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'INV-2024-001' })
  @IsString()
  @MaxLength(50)
  invoiceNumber: string;

  @ApiProperty({ enum: InvoiceType, example: InvoiceType.CUSTOMER })
  @IsEnum(InvoiceType)
  type: InvoiceType;

  @ApiProperty({ description: 'Company ID' })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ description: 'Contact ID' })
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ example: '2024-12-07', type: Date })
  @Type(() => Date)
  @IsDate()
  issueDate: Date;

  @ApiProperty({ example: '2024-12-31', type: Date })
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @ApiPropertyOptional({ description: 'Invoice notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Sales Order ID reference' })
  @IsOptional()
  @IsUUID()
  salesOrderId?: string;

  @ApiProperty({ type: [InvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  lines: InvoiceLineDto[];
}

export class UpdateInvoiceDto {
  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issueDate?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}

export class GenerateInvoiceFromOrderDto {
  @ApiProperty({ example: 'INV-2024-001' })
  @IsString()
  @MaxLength(50)
  invoiceNumber: string;

  @ApiPropertyOptional({ example: '2024-12-07', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issueDate?: Date;

  @ApiPropertyOptional({ example: 30, description: 'Payment terms in days' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paymentTermsDays?: number;
}

import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PosPaymentMethod } from '../../../database/entities';

export class PosTransactionItemDto {
  @ApiProperty({ example: 'product-uuid', description: 'Product ID' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 'Product Name', description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2, description: 'Quantity' })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ example: 50.00, description: 'Unit price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 100.00, description: 'Subtotal' })
  @IsNumber()
  @Min(0)
  subtotal: number;
}

export class CreatePosTransactionDto {
  @ApiProperty({ example: 'session-uuid', description: 'POS Session ID' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ type: [PosTransactionItemDto], description: 'Transaction items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosTransactionItemDto)
  items: PosTransactionItemDto[];

  @ApiProperty({ example: 100.00, description: 'Total amount' })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiProperty({ enum: PosPaymentMethod, description: 'Payment method' })
  @IsEnum(PosPaymentMethod)
  paymentMethod: PosPaymentMethod;

  @ApiPropertyOptional({ example: 0, description: 'Change given to customer' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  changeGiven?: number;

  @ApiPropertyOptional({ example: 'customer-uuid', description: 'Customer ID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ example: 'tenant-uuid', description: 'Company/Tenant ID' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Transaction notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class SyncPosTransactionsDto {
  @ApiProperty({ type: [CreatePosTransactionDto], description: 'Offline transactions to sync' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePosTransactionDto)
  transactions: CreatePosTransactionDto[];
}

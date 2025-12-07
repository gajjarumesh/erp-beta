import {
  IsString,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../../database/entities';

export class CreatePaymentDto {
  @ApiProperty({ example: 'PAY-2024-001' })
  @IsString()
  @MaxLength(50)
  paymentNumber: string;

  @ApiProperty({ description: 'Invoice ID' })
  @IsUUID()
  invoiceId: string;

  @ApiProperty({ example: 1000.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '2024-12-07', type: Date })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.BANK })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ example: 'CH123456789', description: 'Gateway reference' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  gatewayRef?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  gatewayRef?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

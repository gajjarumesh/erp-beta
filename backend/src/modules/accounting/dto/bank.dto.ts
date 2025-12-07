import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty({ example: 'Main Business Account' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @MaxLength(100)
  accountNumber: string;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: 'Chase Bank' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bankName?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBankAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ImportBankTransactionDto {
  @ApiProperty({ description: 'Bank account ID' })
  @IsUUID()
  bankAccountId: string;

  @ApiProperty({ example: '2024-12-07', type: Date })
  @IsString()
  date: string;

  @ApiProperty({ example: 1000.00 })
  @IsString()
  amount: string;

  @ApiProperty({ example: 'Payment from customer' })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiPropertyOptional({ example: 'REF123' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string;
}

export class MatchBankTransactionDto {
  @ApiProperty({ description: 'Bank transaction ID' })
  @IsUUID()
  transactionId: string;

  @ApiProperty({ description: 'Invoice ID to match' })
  @IsUUID()
  invoiceId: string;
}

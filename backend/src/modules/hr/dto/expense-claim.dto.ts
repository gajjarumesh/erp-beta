import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseStatus } from '../../../database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseClaimDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  expenseDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  attachments?: Array<{ filename: string; url: string }>;
}

export class UpdateExpenseClaimDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expenseDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  attachments?: Array<{ filename: string; url: string }>;
}

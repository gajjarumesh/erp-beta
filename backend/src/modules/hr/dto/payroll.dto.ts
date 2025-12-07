import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsArray, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollCycle } from '../../../database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayrollConfigDto {
  @ApiProperty()
  @IsUUID()
  employeeId: string;

  @ApiProperty()
  @IsNumber()
  baseSalary: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  allowances?: Array<{ name: string; amount: number; type: 'fixed' | 'percentage' }>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  deductions?: Array<{ name: string; amount: number; type: 'fixed' | 'percentage' }>;

  @ApiProperty({ enum: PayrollCycle, default: PayrollCycle.MONTHLY })
  @IsOptional()
  @IsEnum(PayrollCycle)
  cycle?: PayrollCycle;

  @ApiProperty({ default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

export class UpdatePayrollConfigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  baseSalary?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  allowances?: Array<{ name: string; amount: number; type: 'fixed' | 'percentage' }>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  deductions?: Array<{ name: string; amount: number; type: 'fixed' | 'percentage' }>;

  @ApiProperty({ enum: PayrollCycle, required: false })
  @IsOptional()
  @IsEnum(PayrollCycle)
  cycle?: PayrollCycle;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  effectiveTo?: Date;
}

export class GeneratePayrollDto {
  @ApiProperty()
  @IsString()
  period: string; // Format: YYYY-MM
}

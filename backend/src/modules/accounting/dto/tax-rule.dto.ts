import {
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsOptional,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaxType } from '../../../database/entities';

export class CreateTaxRuleDto {
  @ApiProperty({ example: 'VAT Standard Rate' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'VAT-20' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 20.00, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @ApiProperty({ enum: TaxType, example: TaxType.EXCLUSIVE })
  @IsEnum(TaxType)
  type: TaxType;

  @ApiPropertyOptional({ example: 'UK' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Tax rule description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTaxRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  rate?: number;

  @ApiPropertyOptional({ enum: TaxType })
  @IsOptional()
  @IsEnum(TaxType)
  type?: TaxType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

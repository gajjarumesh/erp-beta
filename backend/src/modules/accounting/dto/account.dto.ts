import { IsString, IsEnum, IsOptional, IsBoolean, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType } from '../../../database/entities';

export class CreateAccountDto {
  @ApiProperty({ example: '1000', description: 'Account code' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Cash', description: 'Account name' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ enum: AccountType, example: AccountType.ASSET })
  @IsEnum(AccountType)
  type: AccountType;

  @ApiPropertyOptional({ description: 'Parent account ID' })
  @IsOptional()
  @IsUUID()
  parentAccountId?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Account description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAccountDto {
  @ApiPropertyOptional({ example: 'Cash - Updated' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  parentAccountId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}

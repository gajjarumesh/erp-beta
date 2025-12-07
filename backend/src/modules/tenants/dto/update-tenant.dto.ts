import { IsString, IsOptional, IsUrl, IsBoolean, IsObject, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTenantDto {
  @ApiPropertyOptional({ example: 'Acme Corporation Updated' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'professional' })
  @IsString()
  @IsOptional()
  plan?: string;

  @ApiPropertyOptional({ example: { feature1: true } })
  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'https://acme.com/logo.png' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-F]{6}$/i)
  primaryColor?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsString()
  @IsOptional()
  timezone?: string;
}

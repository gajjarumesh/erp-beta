import { IsString, IsEnum, IsOptional, IsInt, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus, LeadSource } from '../../../database/entities';

export class CreateLeadDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  contactId?: string;

  @ApiPropertyOptional({ enum: LeadStatus, example: LeadStatus.NEW })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ enum: LeadSource, example: LeadSource.WEBSITE })
  @IsEnum(LeadSource)
  @IsOptional()
  source?: LeadSource;

  @ApiPropertyOptional({ example: 75 })
  @IsInt()
  @IsOptional()
  score?: number;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  ownerUserId?: string;

  @ApiPropertyOptional({ example: ['hot', 'enterprise'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'Interested in enterprise plan' })
  @IsString()
  @IsOptional()
  notes?: string;
}

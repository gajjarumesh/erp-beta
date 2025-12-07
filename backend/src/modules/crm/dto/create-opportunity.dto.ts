import { IsUUID, IsOptional, IsNumber, IsInt, IsDateString, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  contactId?: string;

  @ApiProperty()
  @IsUUID()
  pipelineId: string;

  @ApiProperty()
  @IsUUID()
  stageId: string;

  @ApiPropertyOptional({ example: 10000.00 })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsInt()
  @IsOptional()
  probability?: number;

  @ApiPropertyOptional({ example: '2024-06-30' })
  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;
}

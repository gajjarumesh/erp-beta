import { IsDate, IsOptional, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FinancialReportFilterDto {
  @ApiPropertyOptional({ example: '2024-01-01', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @ApiPropertyOptional({ example: '2024-12-31', type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;

  @ApiPropertyOptional({ description: 'Company ID filter' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Dimension for filtering' })
  @IsOptional()
  @IsString()
  dimension?: string;
}

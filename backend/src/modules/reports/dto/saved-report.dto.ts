import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSavedReportDto {
  @ApiProperty({ example: 'revenue-by-month', description: 'Report slug (unique identifier)' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Revenue by Month', description: 'Report name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Report description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Report configuration',
    example: {
      query: 'SELECT * FROM invoices',
      filters: ['date', 'status'],
      visualization: 'bar',
    },
  })
  @IsObject()
  config: Record<string, any>;

  @ApiPropertyOptional({ example: 'Revenue', description: 'Report category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true, description: 'Is report active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateSavedReportDto {
  @ApiPropertyOptional({ example: 'Revenue by Month', description: 'Report name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Report description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Report configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Revenue', description: 'Report category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: true, description: 'Is report active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ExecuteReportDto {
  @ApiPropertyOptional({ description: 'Report parameters', example: { startDate: '2024-01-01', endDate: '2024-12-31' } })
  @IsOptional()
  @IsObject()
  params?: Record<string, any>;
}

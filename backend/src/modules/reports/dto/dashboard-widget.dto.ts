import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDashboardWidgetDto {
  @ApiProperty({ example: 'Revenue Chart', description: 'Widget name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'chart', description: 'Widget type (chart, table, metric, list)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Widget configuration',
    example: {
      dataSource: 'revenue-by-month',
      chartType: 'bar',
      colors: ['#4F46E5'],
    },
  })
  @IsObject()
  config: Record<string, any>;

  @ApiProperty({
    description: 'Widget position and size',
    example: { x: 0, y: 0, width: 4, height: 3 },
  })
  @IsObject()
  position: Record<string, any>;

  @ApiPropertyOptional({ example: 'revenue-by-month', description: 'Report slug to link' })
  @IsOptional()
  @IsString()
  reportSlug?: string;

  @ApiPropertyOptional({ example: true, description: 'Is widget active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateDashboardWidgetDto {
  @ApiPropertyOptional({ example: 'Revenue Chart', description: 'Widget name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'chart', description: 'Widget type' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Widget configuration' })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Widget position and size' })
  @IsOptional()
  @IsObject()
  position?: Record<string, any>;

  @ApiPropertyOptional({ example: 'revenue-by-month', description: 'Report slug to link' })
  @IsOptional()
  @IsString()
  reportSlug?: string;

  @ApiPropertyOptional({ example: true, description: 'Is widget active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

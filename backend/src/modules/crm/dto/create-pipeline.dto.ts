import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePipelineDto {
  @ApiProperty({ example: 'Sales Pipeline' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Main sales pipeline' })
  @IsString()
  @IsOptional()
  description?: string;
}

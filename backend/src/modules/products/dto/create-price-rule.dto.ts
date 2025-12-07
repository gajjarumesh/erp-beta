import { IsString, IsBoolean, IsInt, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePriceRuleDto {
  @ApiProperty({ example: 'Volume Discount 10%' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @IsOptional()
  priority?: number;

  @ApiPropertyOptional({ example: { minQty: 10, customerType: 'wholesale' } })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @ApiPropertyOptional({ example: { type: 'percentage', value: 10 } })
  @IsObject()
  @IsOptional()
  calculation?: Record<string, any>;
}

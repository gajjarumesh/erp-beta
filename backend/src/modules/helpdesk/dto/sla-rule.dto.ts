import { IsEnum, IsInt, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSlaRuleDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsInt()
  targetResponseMinutes: number;

  @ApiProperty()
  @IsInt()
  targetResolutionMinutes: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  applicablePriorities?: string[];
}

export class UpdateSlaRuleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  targetResponseMinutes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  targetResolutionMinutes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  applicablePriorities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

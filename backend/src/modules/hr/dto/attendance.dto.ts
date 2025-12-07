import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceSource } from '../../../database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class ClockInDto {
  @ApiProperty({ enum: AttendanceSource, default: AttendanceSource.WEB })
  @IsOptional()
  @IsEnum(AttendanceSource)
  source?: AttendanceSource;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ClockOutDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

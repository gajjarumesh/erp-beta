import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { LeaveType, LeaveStatus } from '../../../database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveRequestDto {
  @ApiProperty({ enum: LeaveType })
  @IsEnum(LeaveType)
  type: LeaveType;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveRequestDto {
  @ApiProperty({ enum: LeaveType, required: false })
  @IsOptional()
  @IsEnum(LeaveType)
  type?: LeaveType;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ApproveLeaveRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  approverNotes?: string;
}

export class RejectLeaveRequestDto {
  @ApiProperty()
  @IsString()
  approverNotes: string;
}

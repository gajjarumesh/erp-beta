import { IsString, IsUUID, IsDate, IsEnum, IsOptional, ValidateNested, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeStatus } from '../../../database/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  employeeCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  joiningDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  salary?: {
    currency?: string;
    amount?: number;
    frequency?: 'hourly' | 'daily' | 'monthly' | 'yearly';
  };

  @ApiProperty({ enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}

export class UpdateEmployeeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  joiningDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  salary?: {
    currency?: string;
    amount?: number;
    frequency?: 'hourly' | 'daily' | 'monthly' | 'yearly';
  };

  @ApiProperty({ enum: EmployeeStatus, required: false })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;
}

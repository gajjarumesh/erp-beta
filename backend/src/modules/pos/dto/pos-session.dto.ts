import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PosSessionStatus } from '../../../database/entities';

export class CreatePosSessionDto {
  @ApiProperty({ example: 100.00, description: 'Opening cash balance' })
  @IsNumber()
  @Min(0)
  openingBalance: number;

  @ApiPropertyOptional({ example: 'tenant-uuid', description: 'Tenant ID (optional)' })
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({ description: 'Session notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ClosePosSessionDto {
  @ApiProperty({ example: 500.00, description: 'Closing cash balance' })
  @IsNumber()
  @Min(0)
  closingBalance: number;

  @ApiPropertyOptional({ description: 'Closing notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PosSessionFilterDto {
  @ApiPropertyOptional({ enum: PosSessionStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(PosSessionStatus)
  status?: PosSessionStatus;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  @IsUUID()
  openedByUserId?: string;
}

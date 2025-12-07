import {
  IsString,
  IsDate,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JournalEntryLineDto {
  @ApiProperty({ description: 'Account ID' })
  @IsUUID()
  accountId: string;

  @ApiProperty({ example: 1000.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  debit: number;

  @ApiProperty({ example: 1000.00, minimum: 0 })
  @IsNumber()
  @Min(0)
  credit: number;

  @ApiPropertyOptional({ description: 'Line description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CreateJournalEntryDto {
  @ApiProperty({ example: 'JE-2024-001' })
  @IsString()
  @MaxLength(50)
  journalNumber: string;

  @ApiProperty({ example: '2024-12-07', type: Date })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiPropertyOptional({ example: 'Invoice #INV-001' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string;

  @ApiPropertyOptional({ description: 'Journal entry memo' })
  @IsOptional()
  @IsString()
  memo?: string;

  @ApiProperty({ type: [JournalEntryLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines: JournalEntryLineDto[];
}

export class UpdateJournalEntryDto {
  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  memo?: string;
}

import { IsString, IsNotEmpty, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SettingsScope } from '../../../database/entities';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'tenant', enum: ['tenant', 'module', 'user'] })
  @IsEnum(SettingsScope)
  @IsNotEmpty()
  scope: SettingsScope;

  @ApiProperty({ example: 'ui.theme.primaryColor' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: { color: '#3B82F6' } })
  @IsObject()
  @IsNotEmpty()
  value: Record<string, any>;
}

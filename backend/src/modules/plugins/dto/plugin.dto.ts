import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePluginDto {
  @ApiProperty({ description: 'Plugin name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Unique plugin key' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Plugin version' })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ description: 'Plugin description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'JSON schema for plugin configuration',
    type: 'object',
  })
  @IsObject()
  configSchema: Record<string, any>;
}

export class UpdatePluginDto {
  @ApiProperty({ description: 'Plugin name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Plugin description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'JSON schema for plugin configuration',
    type: 'object',
    required: false,
  })
  @IsObject()
  @IsOptional()
  configSchema?: Record<string, any>;

  @ApiProperty({ description: 'Is plugin enabled globally', required: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

export class ConfigurePluginDto {
  @ApiProperty({
    description: 'Plugin configuration JSON',
    type: 'object',
  })
  @IsObject()
  config: Record<string, any>;

  @ApiProperty({ description: 'Is plugin enabled for tenant', required: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

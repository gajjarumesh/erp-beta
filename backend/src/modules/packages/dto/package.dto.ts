import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LimitType } from '../../../database/entities';

export class CreateModuleCatalogDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  yearlyPrice: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateSubModuleCatalogDto {
  @IsString()
  moduleId: string;

  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  yearlyPrice: number;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateLimitTypeCatalogDto {
  @IsString()
  slug: string;

  @IsEnum(LimitType)
  type: LimitType;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  unit: string;

  @IsNumber()
  defaultLimit: number;

  @IsNumber()
  pricePerUnit: number;

  @IsOptional()
  @IsNumber()
  incrementStep?: number;
}

class PackageModuleDto {
  @IsString()
  moduleId: string;
}

class PackageSubModuleDto {
  @IsString()
  subModuleId: string;
}

class PackageLimitDto {
  @IsString()
  limitTypeId: string;

  @IsNumber()
  limitValue: number;
}

export class CreateCustomPackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageModuleDto)
  modules: PackageModuleDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageSubModuleDto)
  subModules?: PackageSubModuleDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageLimitDto)
  limits: PackageLimitDto[];
}

export class CalculatePriceDto {
  @IsArray()
  @Type(() => String)
  moduleIds: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  subModuleIds?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageLimitDto)
  limits: PackageLimitDto[];
}

export class UpgradePackageDto {
  @IsString()
  newPackageId: string;

  @IsOptional()
  @IsBoolean()
  keepLockedData?: boolean;
}

import { Controller, Get, Post, Put, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import {
  CreateModuleCatalogDto,
  CreateSubModuleCatalogDto,
  CreateLimitTypeCatalogDto,
  CreateCustomPackageDto,
  CalculatePriceDto,
  UpgradePackageDto,
} from './dto/package.dto';

@ApiTags('Phase 7 - Packages')
@Controller('packages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PackagesController {
  private readonly logger = new Logger(PackagesController.name);

  constructor(private readonly packagesService: PackagesService) {}

  // ==========================================
  // CATALOG ENDPOINTS (Admin Only)
  // ==========================================

  @Post('catalog/modules')
  @ApiOperation({ summary: 'Create module catalog entry (Admin only)' })
  @Permissions('admin:packages:manage')
  async createModuleCatalog(@Body() dto: CreateModuleCatalogDto) {
    return this.packagesService.createModuleCatalog(dto);
  }

  @Get('catalog/modules')
  @ApiOperation({ summary: 'Get modules catalog' })
  async getModulesCatalog() {
    return this.packagesService.getModulesCatalog();
  }

  @Post('catalog/sub-modules')
  @ApiOperation({ summary: 'Create sub-module catalog entry (Admin only)' })
  @Permissions('admin:packages:manage')
  async createSubModuleCatalog(@Body() dto: CreateSubModuleCatalogDto) {
    return this.packagesService.createSubModuleCatalog(dto);
  }

  @Post('catalog/limits')
  @ApiOperation({ summary: 'Create limit type catalog entry (Admin only)' })
  @Permissions('admin:packages:manage')
  async createLimitTypeCatalog(@Body() dto: CreateLimitTypeCatalogDto) {
    return this.packagesService.createLimitTypeCatalog(dto);
  }

  @Get('catalog/limits')
  @ApiOperation({ summary: 'Get limit types catalog' })
  async getLimitTypesCatalog() {
    return this.packagesService.getLimitTypesCatalog();
  }

  // ==========================================
  // PRICING CALCULATOR
  // ==========================================

  @Post('calculate-price')
  @ApiOperation({ summary: 'Calculate package price (real-time)' })
  async calculatePrice(@Body() dto: CalculatePriceDto) {
    return this.packagesService.calculatePrice(dto);
  }

  // ==========================================
  // CUSTOM PACKAGE MANAGEMENT
  // ==========================================

  @Post('custom')
  @ApiOperation({ summary: 'Create custom package' })
  @Permissions('packages:create')
  async createCustomPackage(
    @CurrentUser() user: any,
    @Body() dto: CreateCustomPackageDto,
  ) {
    return this.packagesService.createCustomPackage(user.tenantId, dto);
  }

  @Get('custom')
  @ApiOperation({ summary: 'Get custom packages for tenant' })
  @Permissions('packages:read')
  async getCustomPackages(@CurrentUser() user: any) {
    return this.packagesService.getCustomPackagesByTenant(user.tenantId);
  }

  @Get('custom/:id')
  @ApiOperation({ summary: 'Get custom package by ID' })
  @Permissions('packages:read')
  async getCustomPackageById(@Param('id') id: string) {
    return this.packagesService.getCustomPackageById(id);
  }

  @Put('custom/:id/activate')
  @ApiOperation({ summary: 'Activate custom package (after payment)' })
  @Permissions('packages:update')
  async activatePackage(@Param('id') id: string) {
    return this.packagesService.activatePackage(id);
  }

  @Put('custom/:currentId/upgrade')
  @ApiOperation({ summary: 'Upgrade/Downgrade package' })
  @Permissions('packages:update')
  async upgradePackage(
    @CurrentUser() user: any,
    @Param('currentId') currentId: string,
    @Body() dto: UpgradePackageDto,
  ) {
    return this.packagesService.upgradeDowngradePackage(user.tenantId, currentId, dto);
  }

  @Get('custom/:id/limits')
  @ApiOperation({ summary: 'Get package limits' })
  @Permissions('packages:read')
  async getPackageLimits(@Param('id') id: string) {
    return this.packagesService.getPackageLimits(id);
  }
}

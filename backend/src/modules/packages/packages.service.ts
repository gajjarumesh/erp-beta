import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ModulesCatalog,
  SubModulesCatalog,
  LimitTypesCatalog,
  CustomPackage,
  CustomPackageModule,
  CustomPackageSubModule,
  CustomPackageLimit,
  PackageStatus,
} from '../../database/entities';
import {
  CreateModuleCatalogDto,
  CreateSubModuleCatalogDto,
  CreateLimitTypeCatalogDto,
  CreateCustomPackageDto,
  CalculatePriceDto,
  UpgradePackageDto,
} from './dto/package.dto';

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  constructor(
    @InjectRepository(ModulesCatalog)
    private modulesCatalogRepo: Repository<ModulesCatalog>,
    @InjectRepository(SubModulesCatalog)
    private subModulesCatalogRepo: Repository<SubModulesCatalog>,
    @InjectRepository(LimitTypesCatalog)
    private limitTypesCatalogRepo: Repository<LimitTypesCatalog>,
    @InjectRepository(CustomPackage)
    private customPackageRepo: Repository<CustomPackage>,
    @InjectRepository(CustomPackageModule)
    private customPackageModuleRepo: Repository<CustomPackageModule>,
    @InjectRepository(CustomPackageSubModule)
    private customPackageSubModuleRepo: Repository<CustomPackageSubModule>,
    @InjectRepository(CustomPackageLimit)
    private customPackageLimitRepo: Repository<CustomPackageLimit>,
  ) {}

  // ==========================================
  // CATALOG MANAGEMENT (Admin Only)
  // ==========================================

  async createModuleCatalog(dto: CreateModuleCatalogDto): Promise<ModulesCatalog> {
    const module = this.modulesCatalogRepo.create(dto);
    return this.modulesCatalogRepo.save(module);
  }

  async getModulesCatalog(): Promise<ModulesCatalog[]> {
    return this.modulesCatalogRepo.find({
      where: { isActive: true },
      relations: ['subModules'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async createSubModuleCatalog(dto: CreateSubModuleCatalogDto): Promise<SubModulesCatalog> {
    const subModule = this.subModulesCatalogRepo.create(dto);
    return this.subModulesCatalogRepo.save(subModule);
  }

  async createLimitTypeCatalog(dto: CreateLimitTypeCatalogDto): Promise<LimitTypesCatalog> {
    const limitType = this.limitTypesCatalogRepo.create(dto);
    return this.limitTypesCatalogRepo.save(limitType);
  }

  async getLimitTypesCatalog(): Promise<LimitTypesCatalog[]> {
    return this.limitTypesCatalogRepo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  // ==========================================
  // PRICING ENGINE
  // ==========================================

  /**
   * Calculate total yearly price for a custom package configuration
   * Formula: SUM(module prices) + SUM(sub-module prices) + SUM(limit expansion prices)
   */
  async calculatePrice(dto: CalculatePriceDto): Promise<{
    totalYearlyPrice: number;
    breakdown: {
      modulesPrice: number;
      subModulesPrice: number;
      limitsPrice: number;
      modules: Array<{ id: string; name: string; price: number }>;
      subModules: Array<{ id: string; name: string; price: number }>;
      limits: Array<{ id: string; name: string; value: number; price: number }>;
    };
  }> {
    let modulesPrice = 0;
    let subModulesPrice = 0;
    let limitsPrice = 0;

    const modulesBreakdown: Array<{ id: string; name: string; price: number }> = [];
    const subModulesBreakdown: Array<{ id: string; name: string; price: number }> = [];
    const limitsBreakdown: Array<{ id: string; name: string; value: number; price: number }> = [];

    // Calculate modules price
    if (dto.moduleIds && dto.moduleIds.length > 0) {
      const modules = await this.modulesCatalogRepo.findByIds(dto.moduleIds);
      for (const module of modules) {
        modulesPrice += Number(module.yearlyPrice);
        modulesBreakdown.push({
          id: module.id,
          name: module.name,
          price: Number(module.yearlyPrice),
        });
      }
    }

    // Calculate sub-modules price
    if (dto.subModuleIds && dto.subModuleIds.length > 0) {
      const subModules = await this.subModulesCatalogRepo.findByIds(dto.subModuleIds);
      for (const subModule of subModules) {
        subModulesPrice += Number(subModule.yearlyPrice);
        subModulesBreakdown.push({
          id: subModule.id,
          name: subModule.name,
          price: Number(subModule.yearlyPrice),
        });
      }
    }

    // Calculate limits expansion price
    for (const limit of dto.limits) {
      const limitType = await this.limitTypesCatalogRepo.findOne({
        where: { id: limit.limitTypeId },
      });

      if (!limitType) {
        throw new NotFoundException(`Limit type ${limit.limitTypeId} not found`);
      }

      // Calculate additional units beyond default
      const additionalUnits = Math.max(0, limit.limitValue - limitType.defaultLimit);

      if (additionalUnits > 0) {
        const price = additionalUnits * Number(limitType.pricePerUnit);
        limitsPrice += price;

        limitsBreakdown.push({
          id: limitType.id,
          name: limitType.name,
          value: limit.limitValue,
          price,
        });
      }
    }

    const totalYearlyPrice = modulesPrice + subModulesPrice + limitsPrice;

    return {
      totalYearlyPrice,
      breakdown: {
        modulesPrice,
        subModulesPrice,
        limitsPrice,
        modules: modulesBreakdown,
        subModules: subModulesBreakdown,
        limits: limitsBreakdown,
      },
    };
  }

  // ==========================================
  // CUSTOM PACKAGE MANAGEMENT
  // ==========================================

  /**
   * Create a custom package for a tenant
   */
  async createCustomPackage(tenantId: string, dto: CreateCustomPackageDto): Promise<CustomPackage> {
    // Calculate price
    const pricing = await this.calculatePrice({
      moduleIds: dto.modules.map((m) => m.moduleId),
      subModuleIds: dto.subModules?.map((s) => s.subModuleId) || [],
      limits: dto.limits,
    });

    // Create package
    const customPackage = this.customPackageRepo.create({
      tenantId,
      name: dto.name,
      description: dto.description,
      totalYearlyPrice: pricing.totalYearlyPrice,
      status: PackageStatus.DRAFT,
    });

    const savedPackage = await this.customPackageRepo.save(customPackage);

    // Add modules
    for (const moduleDto of dto.modules) {
      const module = await this.modulesCatalogRepo.findOne({
        where: { id: moduleDto.moduleId },
      });

      if (!module) {
        throw new NotFoundException(`Module ${moduleDto.moduleId} not found`);
      }

      const packageModule = this.customPackageModuleRepo.create({
        packageId: savedPackage.id,
        moduleId: module.id,
        priceAtPurchase: module.yearlyPrice,
        isActive: true,
      });

      await this.customPackageModuleRepo.save(packageModule);
    }

    // Add sub-modules
    if (dto.subModules && dto.subModules.length > 0) {
      for (const subModuleDto of dto.subModules) {
        const subModule = await this.subModulesCatalogRepo.findOne({
          where: { id: subModuleDto.subModuleId },
        });

        if (!subModule) {
          throw new NotFoundException(`Sub-module ${subModuleDto.subModuleId} not found`);
        }

        const packageSubModule = this.customPackageSubModuleRepo.create({
          packageId: savedPackage.id,
          subModuleId: subModule.id,
          priceAtPurchase: subModule.yearlyPrice,
          isActive: true,
        });

        await this.customPackageSubModuleRepo.save(packageSubModule);
      }
    }

    // Add limits
    for (const limitDto of dto.limits) {
      const limitType = await this.limitTypesCatalogRepo.findOne({
        where: { id: limitDto.limitTypeId },
      });

      if (!limitType) {
        throw new NotFoundException(`Limit type ${limitDto.limitTypeId} not found`);
      }

      const additionalUnits = Math.max(0, limitDto.limitValue - limitType.defaultLimit);
      const price = additionalUnits * Number(limitType.pricePerUnit);

      const packageLimit = this.customPackageLimitRepo.create({
        packageId: savedPackage.id,
        limitTypeId: limitType.id,
        limitValue: limitDto.limitValue,
        priceAtPurchase: price,
        isActive: true,
      });

      await this.customPackageLimitRepo.save(packageLimit);
    }

    return this.getCustomPackageById(savedPackage.id);
  }

  /**
   * Get custom package with all details
   */
  async getCustomPackageById(packageId: string): Promise<CustomPackage> {
    const pkg = await this.customPackageRepo.findOne({
      where: { id: packageId, deletedAt: null },
      relations: ['modules', 'subModules', 'limits'],
    });

    if (!pkg) {
      throw new NotFoundException(`Package ${packageId} not found`);
    }

    return pkg;
  }

  /**
   * Get all custom packages for a tenant
   */
  async getCustomPackagesByTenant(tenantId: string): Promise<CustomPackage[]> {
    return this.customPackageRepo.find({
      where: { tenantId, deletedAt: null },
      relations: ['modules', 'subModules', 'limits'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Activate a custom package (called after payment)
   */
  async activatePackage(packageId: string): Promise<CustomPackage> {
    const pkg = await this.getCustomPackageById(packageId);

    if (pkg.status === PackageStatus.ACTIVE) {
      throw new BadRequestException('Package is already active');
    }

    pkg.status = PackageStatus.ACTIVE;
    pkg.activatedAt = new Date();

    return this.customPackageRepo.save(pkg);
  }

  /**
   * Upgrade/Downgrade package
   * Downgrade: Lock data but don't delete
   * Upgrade: Restore data visibility
   */
  async upgradeDowngradePackage(
    tenantId: string,
    currentPackageId: string,
    dto: UpgradePackageDto,
  ): Promise<CustomPackage> {
    const currentPackage = await this.getCustomPackageById(currentPackageId);
    const newPackage = await this.getCustomPackageById(dto.newPackageId);

    if (currentPackage.tenantId !== tenantId || newPackage.tenantId !== tenantId) {
      throw new BadRequestException('Package does not belong to this tenant');
    }

    // Check if it's an upgrade or downgrade
    const isUpgrade = newPackage.totalYearlyPrice >= currentPackage.totalYearlyPrice;

    this.logger.log(
      `${isUpgrade ? 'Upgrading' : 'Downgrading'} package from ${currentPackageId} to ${dto.newPackageId}`,
    );

    // Deactivate old package
    currentPackage.status = PackageStatus.SUSPENDED;
    currentPackage.suspendedAt = new Date();
    await this.customPackageRepo.save(currentPackage);

    // If downgrade, mark modules/limits as inactive (data locking)
    if (!isUpgrade) {
      // Lock data by marking items as inactive
      await this.customPackageModuleRepo.update(
        { packageId: currentPackageId },
        { isActive: false },
      );

      this.logger.log(`Locked data for downgraded modules in package ${currentPackageId}`);
    }

    // Activate new package
    newPackage.status = PackageStatus.ACTIVE;
    newPackage.activatedAt = new Date();
    await this.customPackageRepo.save(newPackage);

    return newPackage;
  }

  /**
   * Get package limits for seat/storage enforcement
   */
  async getPackageLimits(packageId: string): Promise<{
    [key: string]: number;
  }> {
    const limits = await this.customPackageLimitRepo.find({
      where: { packageId, isActive: true },
      relations: ['limitType'],
    });

    const limitsMap: { [key: string]: number } = {};

    for (const limit of limits) {
      limitsMap[limit.limitType.slug] = limit.limitValue;
    }

    return limitsMap;
  }
}

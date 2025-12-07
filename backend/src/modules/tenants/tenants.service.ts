import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, User, Role, Permission } from '../../database/entities';
import { OnboardTenantDto, UpdateTenantDto } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async onboard(dto: OnboardTenantDto): Promise<Tenant> {
    // Check if slug already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { slug: dto.slug },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant with this slug already exists');
    }

    // Check if admin email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.adminEmail },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create tenant
    const tenant = this.tenantRepository.create({
      name: dto.name,
      slug: dto.slug,
      plan: dto.plan || 'free',
      logoUrl: dto.logoUrl,
      primaryColor: dto.primaryColor || '#3B82F6',
      locale: dto.locale || 'en',
      timezone: dto.timezone || 'UTC',
      isActive: true,
    });

    await this.tenantRepository.save(tenant);

    // Create owner role for the tenant
    const ownerRole = this.roleRepository.create({
      tenantId: tenant.id,
      name: 'owner',
      description: 'Owner with full access',
    });
    await this.roleRepository.save(ownerRole);

    // Assign all permissions to owner role
    const allPermissions = await this.permissionRepository.find();
    ownerRole.permissions = allPermissions;
    await this.roleRepository.save(ownerRole);

    // Hash password
    const passwordHash = await argon2.hash(dto.adminPassword);

    // Create admin user
    const adminUser = this.userRepository.create({
      tenantId: tenant.id,
      email: dto.adminEmail,
      displayName: dto.adminName,
      passwordHash,
      isActive: true,
    });

    await this.userRepository.save(adminUser);

    // Assign owner role to admin user
    adminUser.roles = [ownerRole];
    await this.userRepository.save(adminUser);

    return tenant;
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(id: string, dto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    Object.assign(tenant, dto);

    return this.tenantRepository.save(tenant);
  }

  async activate(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.isActive = true;
    return this.tenantRepository.save(tenant);
  }

  async suspend(id: string): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.isActive = false;
    return this.tenantRepository.save(tenant);
  }
}

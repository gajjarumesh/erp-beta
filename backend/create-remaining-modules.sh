#!/bin/bash

# Settings Service
cat > backend/src/modules/settings/settings.service.ts << 'EOFS'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings, SettingsScope } from '../../database/entities';
import { UpdateSettingsDto } from './dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
  ) {}

  async findByScope(tenantId: string, scope: SettingsScope): Promise<Settings[]> {
    return this.settingsRepository.find({
      where: { tenantId, scope },
    });
  }

  async upsert(tenantId: string, dto: UpdateSettingsDto): Promise<Settings> {
    const existing = await this.settingsRepository.findOne({
      where: { tenantId, scope: dto.scope, key: dto.key },
    });

    if (existing) {
      existing.value = dto.value;
      return this.settingsRepository.save(existing);
    }

    const setting = this.settingsRepository.create({
      tenantId,
      scope: dto.scope,
      key: dto.key,
      value: dto.value,
    });

    return this.settingsRepository.save(setting);
  }
}
EOFS

# Settings Controller
cat > backend/src/modules/settings/settings.controller.ts << 'EOFC'
import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserData, RequirePermissions } from '../../common/decorators';
import { SettingsScope } from '../../database/entities';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get settings by scope' })
  @RequirePermissions('core:settings:read')
  async findByScope(
    @CurrentUser() user: CurrentUserData,
    @Query('scope') scope: SettingsScope,
  ) {
    const settings = await this.settingsService.findByScope(
      user.tenantId,
      scope || SettingsScope.TENANT,
    );
    return { success: true, data: settings };
  }

  @Put()
  @ApiOperation({ summary: 'Update or create setting' })
  @RequirePermissions('core:settings:update')
  async upsert(@CurrentUser() user: CurrentUserData, @Body() dto: UpdateSettingsDto) {
    const setting = await this.settingsService.upsert(user.tenantId, dto);
    return { success: true, data: setting, message: 'Setting updated successfully' };
  }
}
EOFC

# Settings Module
cat > backend/src/modules/settings/settings.module.ts << 'EOFM'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { Settings } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
EOFM

# Audit Service
cat > backend/src/modules/audit/audit.service.ts << 'EOFAS'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../database/entities';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(
    tenantId: string,
    filters?: { action?: string; objectType?: string; actorUserId?: string },
  ): Promise<AuditLog[]> {
    const where: any = { tenantId };
    
    if (filters?.action) where.action = filters.action;
    if (filters?.objectType) where.objectType = filters.objectType;
    if (filters?.actorUserId) where.actorUserId = filters.actorUserId;

    return this.auditLogRepository.find({
      where,
      relations: ['actorUser'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
EOFAS

# Audit Controller
cat > backend/src/modules/audit/audit.controller.ts << 'EOFAC'
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserData, RequirePermissions } from '../../common/decorators';

@ApiTags('audit')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  @RequirePermissions('core:audit:read')
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('action') action?: string,
    @Query('objectType') objectType?: string,
    @Query('actorUserId') actorUserId?: string,
  ) {
    const logs = await this.auditService.findAll(user.tenantId, {
      action,
      objectType,
      actorUserId,
    });
    return { success: true, data: logs };
  }
}
EOFAC

# Audit Module
cat > backend/src/modules/audit/audit.module.ts << 'EOFAM'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditLog } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
EOFAM

echo "✅ All remaining modules created!"

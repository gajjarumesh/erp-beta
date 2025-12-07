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

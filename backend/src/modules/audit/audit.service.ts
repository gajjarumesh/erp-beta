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

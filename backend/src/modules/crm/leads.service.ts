import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Lead, LeadStatus } from '../../database/entities';
import { CreateLeadDto, UpdateLeadDto } from './dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(tenantId: string, dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...dto,
      tenantId,
    });

    return await this.leadRepository.save(lead);
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: LeadStatus;
      ownerUserId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Lead[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Lead> = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.ownerUserId) {
      where.ownerUserId = filters.ownerUserId;
    }

    const [data, total] = await this.leadRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['company', 'contact', 'ownerUser'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string, id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id, tenantId },
      relations: ['company', 'contact', 'ownerUser'],
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async update(tenantId: string, id: string, dto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(tenantId, id);
    Object.assign(lead, dto);
    return await this.leadRepository.save(lead);
  }

  async updateStatus(tenantId: string, id: string, status: LeadStatus): Promise<Lead> {
    const lead = await this.findOne(tenantId, id);
    lead.status = status;
    return await this.leadRepository.save(lead);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const lead = await this.findOne(tenantId, id);
    await this.leadRepository.softRemove(lead);
  }
}

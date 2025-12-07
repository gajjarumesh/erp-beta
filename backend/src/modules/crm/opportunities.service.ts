import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Opportunity } from '../../database/entities';
import { CreateOpportunityDto, UpdateOpportunityDto } from './dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
  ) {}

  async create(tenantId: string, dto: CreateOpportunityDto): Promise<Opportunity> {
    const opportunity = this.opportunityRepository.create({
      ...dto,
      tenantId,
    });

    return await this.opportunityRepository.save(opportunity);
  }

  async findAll(
    tenantId: string,
    filters?: {
      pipelineId?: string;
      stageId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Opportunity[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Opportunity> = { tenantId };

    if (filters?.pipelineId) {
      where.pipelineId = filters.pipelineId;
    }

    if (filters?.stageId) {
      where.stageId = filters.stageId;
    }

    const [data, total] = await this.opportunityRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['company', 'contact', 'pipeline', 'stage'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string, id: string): Promise<Opportunity> {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id, tenantId },
      relations: ['company', 'contact', 'pipeline', 'stage'],
    });

    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }

    return opportunity;
  }

  async update(tenantId: string, id: string, dto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.findOne(tenantId, id);
    Object.assign(opportunity, dto);
    return await this.opportunityRepository.save(opportunity);
  }

  async updateStage(tenantId: string, id: string, stageId: string): Promise<Opportunity> {
    const opportunity = await this.findOne(tenantId, id);
    opportunity.stageId = stageId;
    return await this.opportunityRepository.save(opportunity);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const opportunity = await this.findOne(tenantId, id);
    await this.opportunityRepository.softRemove(opportunity);
  }
}

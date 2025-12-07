import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceRule } from '../../database/entities';
import { CreatePriceRuleDto, UpdatePriceRuleDto } from './dto';

@Injectable()
export class PriceRulesService {
  constructor(
    @InjectRepository(PriceRule)
    private priceRuleRepository: Repository<PriceRule>,
  ) {}

  async create(tenantId: string, dto: CreatePriceRuleDto): Promise<PriceRule> {
    const priceRule = this.priceRuleRepository.create({
      ...dto,
      tenantId,
    });

    return await this.priceRuleRepository.save(priceRule);
  }

  async findAll(tenantId: string, activeOnly = false): Promise<PriceRule[]> {
    const where: any = { tenantId };
    
    if (activeOnly) {
      where.active = true;
    }

    return await this.priceRuleRepository.find({
      where,
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<PriceRule> {
    const priceRule = await this.priceRuleRepository.findOne({
      where: { id, tenantId },
    });

    if (!priceRule) {
      throw new NotFoundException('Price rule not found');
    }

    return priceRule;
  }

  async update(tenantId: string, id: string, dto: UpdatePriceRuleDto): Promise<PriceRule> {
    const priceRule = await this.findOne(tenantId, id);
    Object.assign(priceRule, dto);
    return await this.priceRuleRepository.save(priceRule);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const priceRule = await this.findOne(tenantId, id);
    await this.priceRuleRepository.softRemove(priceRule);
  }
}

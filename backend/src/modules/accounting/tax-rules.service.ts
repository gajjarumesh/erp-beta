import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TaxRule } from '../../database/entities';
import { CreateTaxRuleDto, UpdateTaxRuleDto } from './dto';

@Injectable()
export class TaxRulesService {
  constructor(
    @InjectRepository(TaxRule)
    private taxRulesRepository: Repository<TaxRule>,
  ) {}

  async create(tenantId: string, createDto: CreateTaxRuleDto): Promise<TaxRule> {
    const taxRule = this.taxRulesRepository.create({
      tenantId,
      ...createDto,
    });

    return this.taxRulesRepository.save(taxRule);
  }

  async findAll(tenantId: string, activeOnly: boolean = false): Promise<TaxRule[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (activeOnly) {
      where.isActive = true;
    }

    return this.taxRulesRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TaxRule> {
    const taxRule = await this.taxRulesRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!taxRule) {
      throw new NotFoundException('Tax rule not found');
    }

    return taxRule;
  }

  async findByCode(code: string): Promise<TaxRule> {
    const taxRule = await this.taxRulesRepository.findOne({
      where: { code, deletedAt: IsNull() },
    });

    if (!taxRule) {
      throw new NotFoundException('Tax rule not found');
    }

    return taxRule;
  }

  async update(id: string, updateDto: UpdateTaxRuleDto): Promise<TaxRule> {
    const taxRule = await this.findOne(id);
    Object.assign(taxRule, updateDto);
    return this.taxRulesRepository.save(taxRule);
  }

  async remove(id: string): Promise<void> {
    const taxRule = await this.findOne(id);
    taxRule.deletedAt = new Date();
    await this.taxRulesRepository.save(taxRule);
  }

  async calculateTax(amount: number, taxRuleId: string): Promise<number> {
    const taxRule = await this.findOne(taxRuleId);

    if (!taxRule.isActive) {
      return 0;
    }

    return amount * (taxRule.rate / 100);
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Company, CompanyType } from '../../database/entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async create(tenantId: string, dto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create({
      ...dto,
      tenantId,
    });

    return await this.companyRepository.save(company);
  }

  async findAll(
    tenantId: string,
    filters?: {
      type?: CompanyType;
      search?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Company[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Company> = { tenantId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.search) {
      where.name = Like(`%${filters.search}%`);
    }

    const [data, total] = await this.companyRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string, id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id, tenantId },
      relations: ['contacts', 'leads', 'opportunities'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(tenantId: string, id: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(tenantId, id);

    Object.assign(company, dto);

    return await this.companyRepository.save(company);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const company = await this.findOne(tenantId, id);
    await this.companyRepository.softRemove(company);
  }
}

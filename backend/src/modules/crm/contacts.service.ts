import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Contact } from '../../database/entities';
import { CreateContactDto, UpdateContactDto } from './dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(tenantId: string, dto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create({
      ...dto,
      tenantId,
    });

    return await this.contactRepository.save(contact);
  }

  async findAll(
    tenantId: string,
    filters?: {
      companyId?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: Contact[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Contact> = { tenantId };

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    const [data, total] = await this.contactRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['company'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string, id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, tenantId },
      relations: ['company'],
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async update(tenantId: string, id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(tenantId, id);
    Object.assign(contact, dto);
    return await this.contactRepository.save(contact);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const contact = await this.findOne(tenantId, id);
    await this.contactRepository.softRemove(contact);
  }
}

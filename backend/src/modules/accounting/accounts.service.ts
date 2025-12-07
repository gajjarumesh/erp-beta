import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Account, AccountType } from '../../database/entities';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(tenantId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    // Check if code already exists
    const existing = await this.accountsRepository.findOne({
      where: { code: createAccountDto.code, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException('Account code already exists');
    }

    const account = this.accountsRepository.create({
      ...createAccountDto,
      tenantId,
    });

    return this.accountsRepository.save(account);
  }

  async findAll(tenantId: string, type?: AccountType): Promise<Account[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (type) {
      where.type = type;
    }

    return this.accountsRepository.find({
      where,
      relations: ['parentAccount', 'childAccounts'],
      order: { code: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['parentAccount', 'childAccounts'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const account = await this.findOne(id);

    // Prevent updating system accounts' core properties
    if (account.isSystem) {
      throw new BadRequestException('Cannot modify system accounts');
    }

    Object.assign(account, updateAccountDto);
    return this.accountsRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);

    // Prevent deleting system accounts
    if (account.isSystem) {
      throw new BadRequestException('Cannot delete system accounts');
    }

    // Soft delete
    account.deletedAt = new Date();
    await this.accountsRepository.save(account);
  }

  async getChartOfAccounts(tenantId: string): Promise<Account[]> {
    // Get all accounts with parent-child relationships
    const accounts = await this.accountsRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['parentAccount', 'childAccounts'],
      order: { code: 'ASC' },
    });

    return accounts;
  }
}

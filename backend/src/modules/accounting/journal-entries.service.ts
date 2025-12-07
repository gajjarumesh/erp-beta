import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { JournalEntry, JournalEntryLine } from '../../database/entities';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto';

@Injectable()
export class JournalEntriesService {
  constructor(
    @InjectRepository(JournalEntry)
    private journalEntriesRepository: Repository<JournalEntry>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLinesRepository: Repository<JournalEntryLine>,
  ) {}

  async create(
    tenantId: string,
    userId: string,
    createDto: CreateJournalEntryDto,
  ): Promise<JournalEntry> {
    // Validate that journal entry is balanced
    this.validateBalance(createDto.lines);

    // Check if journal number already exists
    const existing = await this.journalEntriesRepository.findOne({
      where: { journalNumber: createDto.journalNumber, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException('Journal number already exists');
    }

    const entry = this.journalEntriesRepository.create({
      tenantId,
      createdByUserId: userId,
      journalNumber: createDto.journalNumber,
      date: createDto.date,
      reference: createDto.reference,
      memo: createDto.memo,
      lines: createDto.lines.map((line) => ({
        accountId: line.accountId,
        debit: line.debit,
        credit: line.credit,
        description: line.description,
      })),
    });

    return this.journalEntriesRepository.save(entry);
  }

  private validateBalance(lines: any[]): void {
    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.credit), 0);

    // Allow small rounding differences (0.01)
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(
        `Journal entry is not balanced. Debits: ${totalDebit}, Credits: ${totalCredit}`,
      );
    }
  }

  async findAll(tenantId: string): Promise<JournalEntry[]> {
    return this.journalEntriesRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['lines', 'lines.account', 'createdByUser'],
      order: { date: 'DESC', journalNumber: 'DESC' },
    });
  }

  async findOne(id: string): Promise<JournalEntry> {
    const entry = await this.journalEntriesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['lines', 'lines.account', 'createdByUser'],
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    return entry;
  }

  async update(id: string, updateDto: UpdateJournalEntryDto): Promise<JournalEntry> {
    const entry = await this.findOne(id);

    // Prevent updating posted entries
    if (entry.isPosted) {
      throw new BadRequestException('Cannot update posted journal entries');
    }

    Object.assign(entry, updateDto);
    return this.journalEntriesRepository.save(entry);
  }

  async post(id: string): Promise<JournalEntry> {
    const entry = await this.findOne(id);

    if (entry.isPosted) {
      throw new BadRequestException('Journal entry is already posted');
    }

    entry.isPosted = true;
    return this.journalEntriesRepository.save(entry);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.findOne(id);

    // Prevent deleting posted entries
    if (entry.isPosted) {
      throw new BadRequestException('Cannot delete posted journal entries');
    }

    // Soft delete
    entry.deletedAt = new Date();
    await this.journalEntriesRepository.save(entry);
  }
}

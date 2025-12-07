import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PosTransaction, PosSession, PosSessionStatus } from '../../database/entities';
import { CreatePosTransactionDto, SyncPosTransactionsDto } from './dto/pos-transaction.dto';

@Injectable()
export class PosTransactionsService {
  constructor(
    @InjectRepository(PosTransaction)
    private readonly posTransactionRepository: Repository<PosTransaction>,
    @InjectRepository(PosSession)
    private readonly posSessionRepository: Repository<PosSession>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreatePosTransactionDto): Promise<PosTransaction> {
    // Verify session exists and is open
    const session = await this.posSessionRepository.findOne({
      where: { id: createDto.sessionId },
    });

    if (!session) {
      throw new NotFoundException(`POS Session with ID ${createDto.sessionId} not found`);
    }

    if (session.status !== PosSessionStatus.OPEN) {
      throw new BadRequestException('Cannot create transaction for a closed session');
    }

    // Generate unique receipt number
    const receiptNumber = await this.generateReceiptNumber();

    const transaction = this.posTransactionRepository.create({
      ...createDto,
      receiptNumber,
      items: createDto.items as any,
    });

    return this.posTransactionRepository.save(transaction);
  }

  async findAll(sessionId?: string): Promise<PosTransaction[]> {
    const query = this.posTransactionRepository.createQueryBuilder('transaction');

    if (sessionId) {
      query.andWhere('transaction.sessionId = :sessionId', { sessionId });
    }

    query.orderBy('transaction.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<PosTransaction> {
    const transaction = await this.posTransactionRepository.findOne({
      where: { id },
      relations: ['session'],
    });

    if (!transaction) {
      throw new NotFoundException(`POS Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async syncTransactions(syncDto: SyncPosTransactionsDto): Promise<{ success: number; failed: number; errors: any[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const transactionDto of syncDto.transactions) {
      try {
        await this.create(transactionDto);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          transaction: transactionDto,
          error: error.message,
        });
      }
    }

    return results;
  }

  private async generateReceiptNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    const count = await this.posTransactionRepository.count();
    const sequence = (count + 1).toString().padStart(6, '0');
    
    return `POS${year}${month}${day}-${sequence}`;
  }
}

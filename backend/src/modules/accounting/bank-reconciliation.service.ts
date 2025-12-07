import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { BankAccount, BankTransaction, BankTransactionStatus, Invoice } from '../../database/entities';
import { CreateBankAccountDto, UpdateBankAccountDto, ImportBankTransactionDto, MatchBankTransactionDto } from './dto';

@Injectable()
export class BankReconciliationService {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountsRepository: Repository<BankAccount>,
    @InjectRepository(BankTransaction)
    private bankTransactionsRepository: Repository<BankTransaction>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  // Bank Account Management
  async createBankAccount(tenantId: string, createDto: CreateBankAccountDto): Promise<BankAccount> {
    const account = this.bankAccountsRepository.create({
      tenantId,
      ...createDto,
    });

    return this.bankAccountsRepository.save(account);
  }

  async findAllBankAccounts(tenantId: string): Promise<BankAccount[]> {
    return this.bankAccountsRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['transactions'],
      order: { name: 'ASC' },
    });
  }

  async findOneBankAccount(id: string): Promise<BankAccount> {
    const account = await this.bankAccountsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['transactions'],
    });

    if (!account) {
      throw new NotFoundException('Bank account not found');
    }

    return account;
  }

  async updateBankAccount(id: string, updateDto: UpdateBankAccountDto): Promise<BankAccount> {
    const account = await this.findOneBankAccount(id);
    Object.assign(account, updateDto);
    return this.bankAccountsRepository.save(account);
  }

  async removeBankAccount(id: string): Promise<void> {
    const account = await this.findOneBankAccount(id);
    account.deletedAt = new Date();
    await this.bankAccountsRepository.save(account);
  }

  // Bank Transaction Management
  async importBankTransaction(importDto: ImportBankTransactionDto): Promise<BankTransaction> {
    const transaction = this.bankTransactionsRepository.create({
      bankAccountId: importDto.bankAccountId,
      date: new Date(importDto.date),
      amount: parseFloat(importDto.amount),
      description: importDto.description,
      reference: importDto.reference,
      status: BankTransactionStatus.UNMATCHED,
    });

    return this.bankTransactionsRepository.save(transaction);
  }

  async importBankTransactionsBatch(transactions: ImportBankTransactionDto[]): Promise<BankTransaction[]> {
    const imported: BankTransaction[] = [];

    for (const transaction of transactions) {
      try {
        const result = await this.importBankTransaction(transaction);
        imported.push(result);
      } catch (error) {
        // Log error but continue with other transactions
        console.error('Error importing transaction:', error);
      }
    }

    return imported;
  }

  async findAllBankTransactions(
    bankAccountId: string,
    status?: BankTransactionStatus,
  ): Promise<BankTransaction[]> {
    const where: any = { bankAccountId };
    
    if (status) {
      where.status = status;
    }

    return this.bankTransactionsRepository.find({
      where,
      relations: ['bankAccount', 'matchedInvoice', 'matchedInvoice.company'],
      order: { date: 'DESC' },
    });
  }

  async findOneBankTransaction(id: string): Promise<BankTransaction> {
    const transaction = await this.bankTransactionsRepository.findOne({
      where: { id },
      relations: ['bankAccount', 'matchedInvoice', 'matchedInvoice.company'],
    });

    if (!transaction) {
      throw new NotFoundException('Bank transaction not found');
    }

    return transaction;
  }

  async matchTransaction(matchDto: MatchBankTransactionDto): Promise<BankTransaction> {
    const transaction = await this.findOneBankTransaction(matchDto.transactionId);

    if (transaction.status === BankTransactionStatus.MATCHED) {
      throw new BadRequestException('Transaction is already matched');
    }

    // Verify invoice exists
    const invoice = await this.invoicesRepository.findOne({
      where: { id: matchDto.invoiceId, deletedAt: IsNull() },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Match transaction to invoice
    transaction.matchedInvoiceId = matchDto.invoiceId;
    transaction.status = BankTransactionStatus.MATCHED;

    return this.bankTransactionsRepository.save(transaction);
  }

  async unmatchTransaction(transactionId: string): Promise<BankTransaction> {
    const transaction = await this.findOneBankTransaction(transactionId);

    transaction.matchedInvoiceId = null;
    transaction.status = BankTransactionStatus.UNMATCHED;

    return this.bankTransactionsRepository.save(transaction);
  }

  async reconcileTransaction(transactionId: string): Promise<BankTransaction> {
    const transaction = await this.findOneBankTransaction(transactionId);

    if (transaction.status !== BankTransactionStatus.MATCHED) {
      throw new BadRequestException('Transaction must be matched before reconciling');
    }

    transaction.status = BankTransactionStatus.RECONCILED;
    return this.bankTransactionsRepository.save(transaction);
  }

  async suggestMatches(transactionId: string): Promise<Invoice[]> {
    const transaction = await this.findOneBankTransaction(transactionId);

    // Smart matching logic: match by amount, date range, and reference
    const dateFrom = new Date(transaction.date);
    dateFrom.setDate(dateFrom.getDate() - 7); // Look 7 days before
    
    const dateTo = new Date(transaction.date);
    dateTo.setDate(dateTo.getDate() + 7); // Look 7 days after

    const amount = Math.abs(transaction.amount);

    const suggestions = await this.invoicesRepository.find({
      where: {
        balance: amount,
        issueDate: Between(dateFrom, dateTo),
        deletedAt: IsNull(),
      },
      relations: ['company'],
      take: 10,
    });

    // Additional filtering by reference if available
    if (transaction.reference && transaction.reference.trim() !== '') {
      return suggestions.filter(
        (invoice) =>
          invoice.invoiceNumber.includes(transaction.reference!) ||
          transaction.reference!.includes(invoice.invoiceNumber),
      );
    }

    return suggestions;
  }
}

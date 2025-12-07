import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Payment, Invoice, InvoiceStatus } from '../../database/entities';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  async create(
    tenantId: string,
    userId: string,
    createDto: CreatePaymentDto,
  ): Promise<Payment> {
    // Check if payment number already exists
    const existing = await this.paymentsRepository.findOne({
      where: { paymentNumber: createDto.paymentNumber, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException('Payment number already exists');
    }

    // Verify invoice exists and has balance
    const invoice = await this.invoicesRepository.findOne({
      where: { id: createDto.invoiceId, tenantId, deletedAt: IsNull() },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.balance <= 0) {
      throw new BadRequestException('Invoice is already fully paid');
    }

    if (createDto.amount > invoice.balance) {
      throw new BadRequestException('Payment amount exceeds invoice balance');
    }

    // Create payment
    const payment = this.paymentsRepository.create({
      tenantId,
      createdByUserId: userId,
      ...createDto,
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    // Update invoice balance
    invoice.balance -= createDto.amount;
    
    // Mark invoice as paid if fully paid
    if (invoice.balance <= 0.01) { // Allow for rounding
      invoice.balance = 0;
      invoice.status = InvoiceStatus.PAID;
    }

    await this.invoicesRepository.save(invoice);

    // Note: Payment journal entry generation not yet implemented
    // TODO: Implement journal entry generation for payments
    // This requires account mapping configuration
    // Manual journal entries can be created through the journal entries API
    
    /* Future implementation:
    const accountMapping = await this.getAccountMapping(tenantId);
    
    if (invoice.type === InvoiceType.CUSTOMER) {
      // Debit Cash/Bank, Credit AR
      await this.journalEntriesService.create(tenantId, userId, {
        journalNumber: `JE-PAY-${payment.paymentNumber}`,
        date: payment.date,
        reference: `Payment ${payment.paymentNumber}`,
        memo: `Payment for Invoice ${invoice.invoiceNumber}`,
        lines: [
          {
            accountId: accountMapping.cash,
            debit: payment.amount,
            credit: 0,
            description: 'Cash received',
          },
          {
            accountId: accountMapping.accountsReceivable,
            debit: 0,
            credit: payment.amount,
            description: 'AR payment',
          },
        ],
      });
    }
    */

    return savedPayment;
  }

  async findAll(tenantId: string, invoiceId?: string): Promise<Payment[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (invoiceId) {
      where.invoiceId = invoiceId;
    }

    return this.paymentsRepository.find({
      where,
      relations: ['invoice', 'invoice.company', 'createdByUser'],
      order: { date: 'DESC', paymentNumber: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['invoice', 'invoice.company', 'createdByUser', 'journalEntry'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(id: string, updateDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);

    Object.assign(payment, updateDto);
    return this.paymentsRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);

    // Restore invoice balance
    const invoice = await this.invoicesRepository.findOne({
      where: { id: payment.invoiceId },
    });

    if (invoice) {
      invoice.balance += payment.amount;
      if (invoice.status === InvoiceStatus.PAID) {
        invoice.status = InvoiceStatus.SENT;
      }
      await this.invoicesRepository.save(invoice);
    }

    // Soft delete
    payment.deletedAt = new Date();
    await this.paymentsRepository.save(payment);
  }
}

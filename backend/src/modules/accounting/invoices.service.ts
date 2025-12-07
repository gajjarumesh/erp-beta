import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThanOrEqual } from 'typeorm';
import { Invoice, InvoiceLine, InvoiceStatus, InvoiceType, SalesOrder } from '../../database/entities';
import { CreateInvoiceDto, UpdateInvoiceDto, GenerateInvoiceFromOrderDto } from './dto';
import { JournalEntriesService } from './journal-entries.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(InvoiceLine)
    private invoiceLinesRepository: Repository<InvoiceLine>,
    @InjectRepository(SalesOrder)
    private salesOrdersRepository: Repository<SalesOrder>,
    private journalEntriesService: JournalEntriesService,
  ) {}

  async create(
    tenantId: string,
    userId: string,
    createDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    // Check if invoice number already exists
    const existing = await this.invoicesRepository.findOne({
      where: { invoiceNumber: createDto.invoiceNumber, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException('Invoice number already exists');
    }

    // Calculate totals
    const { subtotal, taxTotal, discountTotal, total } = this.calculateTotals(createDto.lines);

    const invoice = this.invoicesRepository.create({
      tenantId,
      createdByUserId: userId,
      invoiceNumber: createDto.invoiceNumber,
      type: createDto.type,
      companyId: createDto.companyId,
      contactId: createDto.contactId,
      currency: createDto.currency || 'USD',
      issueDate: createDto.issueDate,
      dueDate: createDto.dueDate,
      notes: createDto.notes,
      salesOrderId: createDto.salesOrderId,
      subtotal,
      taxTotal,
      discountTotal,
      total,
      balance: total,
      lines: createDto.lines.map((line) => ({
        productId: line.productId,
        description: line.description,
        qty: line.qty,
        unitPrice: line.unitPrice,
        taxRate: line.taxRate || 0,
        discount: line.discount || 0,
        total: this.calculateLineTotal(line),
      })),
    });

    return this.invoicesRepository.save(invoice);
  }

  private calculateLineTotal(line: any): number {
    const lineSubtotal = line.qty * line.unitPrice;
    const discountAmount = line.discount || 0;
    const afterDiscount = lineSubtotal - discountAmount;
    const taxAmount = afterDiscount * ((line.taxRate || 0) / 100);
    return afterDiscount + taxAmount;
  }

  private calculateTotals(lines: any[]) {
    let subtotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;

    lines.forEach((line) => {
      const lineSubtotal = line.qty * line.unitPrice;
      subtotal += lineSubtotal;
      discountTotal += line.discount || 0;
      const afterDiscount = lineSubtotal - (line.discount || 0);
      taxTotal += afterDiscount * ((line.taxRate || 0) / 100);
    });

    const total = subtotal - discountTotal + taxTotal;

    return { subtotal, taxTotal, discountTotal, total };
  }

  async findAll(tenantId: string, status?: InvoiceStatus, type?: InvoiceType): Promise<Invoice[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    return this.invoicesRepository.find({
      where,
      relations: ['company', 'contact', 'lines', 'lines.product'],
      order: { issueDate: 'DESC', invoiceNumber: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['company', 'contact', 'lines', 'lines.product', 'payments', 'journalEntry'],
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async update(id: string, updateDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    // Only allow updates on draft invoices
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be updated');
    }

    Object.assign(invoice, updateDto);
    return this.invoicesRepository.save(invoice);
  }

  async send(id: string, userId: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be sent');
    }

    // Generate journal entry for the invoice
    await this.generateJournalEntry(invoice, userId);

    invoice.status = InvoiceStatus.SENT;
    return this.invoicesRepository.save(invoice);
  }

  async markAsPaid(id: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    invoice.status = InvoiceStatus.PAID;
    invoice.balance = 0;
    return this.invoicesRepository.save(invoice);
  }

  async cancel(id: string): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot cancel paid invoices');
    }

    invoice.status = InvoiceStatus.CANCELLED;
    return this.invoicesRepository.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);

    // Only allow deletion of draft invoices
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('Only draft invoices can be deleted');
    }

    // Soft delete
    invoice.deletedAt = new Date();
    await this.invoicesRepository.save(invoice);
  }

  async generateFromSalesOrder(
    orderId: string,
    tenantId: string,
    userId: string,
    generateDto: GenerateInvoiceFromOrderDto,
  ): Promise<Invoice> {
    const order = await this.salesOrdersRepository.findOne({
      where: { id: orderId, tenantId, deletedAt: IsNull() },
      relations: ['lines', 'lines.product'],
    });

    if (!order) {
      throw new NotFoundException('Sales order not found');
    }

    const issueDate = generateDto.issueDate || new Date();
    const paymentTermsDays = generateDto.paymentTermsDays || 30;
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + paymentTermsDays);

    const invoiceLines = order.lines.map((line) => ({
      productId: line.productId,
      description: line.description,
      qty: line.qty,
      unitPrice: line.unitPrice,
      taxRate: line.taxRate,
      discount: line.discount,
    }));

    return this.create(tenantId, userId, {
      invoiceNumber: generateDto.invoiceNumber,
      type: InvoiceType.CUSTOMER,
      companyId: order.companyId,
      contactId: order.contactId,
      currency: order.currency,
      issueDate,
      dueDate,
      notes: order.notes,
      salesOrderId: order.id,
      lines: invoiceLines,
    });
  }

  async checkOverdueInvoices(tenantId: string): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueInvoices = await this.invoicesRepository.find({
      where: {
        tenantId,
        status: InvoiceStatus.SENT,
        dueDate: LessThanOrEqual(today),
        deletedAt: IsNull(),
      },
    });

    for (const invoice of overdueInvoices) {
      invoice.status = InvoiceStatus.OVERDUE;
      await this.invoicesRepository.save(invoice);
    }
  }

  private async generateJournalEntry(invoice: Invoice, userId: string): Promise<void> {
    // Generate journal entry based on invoice type
    const lines = [];

    if (invoice.type === InvoiceType.CUSTOMER) {
      // Customer Invoice: Debit AR, Credit Revenue + Tax
      lines.push({
        accountId: 'AR_ACCOUNT_ID', // TODO: Get from settings or chart of accounts
        debit: invoice.total,
        credit: 0,
        description: `Customer Invoice ${invoice.invoiceNumber}`,
      });

      lines.push({
        accountId: 'REVENUE_ACCOUNT_ID', // TODO: Get from settings
        debit: 0,
        credit: invoice.subtotal - invoice.discountTotal,
        description: `Revenue from ${invoice.invoiceNumber}`,
      });

      if (invoice.taxTotal > 0) {
        lines.push({
          accountId: 'TAX_PAYABLE_ACCOUNT_ID', // TODO: Get from settings
          debit: 0,
          credit: invoice.taxTotal,
          description: `Tax on ${invoice.invoiceNumber}`,
        });
      }
    } else {
      // Vendor Bill: Debit Expense + Tax, Credit AP
      lines.push({
        accountId: 'EXPENSE_ACCOUNT_ID', // TODO: Get from settings
        debit: invoice.subtotal - invoice.discountTotal,
        credit: 0,
        description: `Expense from ${invoice.invoiceNumber}`,
      });

      if (invoice.taxTotal > 0) {
        lines.push({
          accountId: 'TAX_RECEIVABLE_ACCOUNT_ID', // TODO: Get from settings
          debit: invoice.taxTotal,
          credit: 0,
          description: `Tax on ${invoice.invoiceNumber}`,
        });
      }

      lines.push({
        accountId: 'AP_ACCOUNT_ID', // TODO: Get from settings
        debit: 0,
        credit: invoice.total,
        description: `Vendor Bill ${invoice.invoiceNumber}`,
      });
    }

    // Note: This is a placeholder. In production, you would create the actual journal entry
    // and link it to the invoice after implementing proper account mapping
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { SalesOrder, SalesOrderLine, SalesOrderStatus, SalesQuote } from '../../database/entities';
import { CreateSalesOrderDto, UpdateSalesOrderDto } from './dto';
import { SalesCalculationHelper } from './sales-calculation.helper';

@Injectable()
export class SalesOrdersService {
  constructor(
    @InjectRepository(SalesOrder)
    private salesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(SalesOrderLine)
    private salesOrderLineRepository: Repository<SalesOrderLine>,
    @InjectRepository(SalesQuote)
    private salesQuoteRepository: Repository<SalesQuote>,
  ) {}

  async create(tenantId: string, dto: CreateSalesOrderDto): Promise<SalesOrder> {
    const order = this.salesOrderRepository.create({
      tenantId,
      companyId: dto.companyId,
      contactId: dto.contactId || undefined,
      orderNumber: dto.orderNumber,
      status: dto.status || SalesOrderStatus.DRAFT,
      currency: dto.currency || 'USD',
      notes: dto.notes || undefined,
    });

    // Calculate totals
    const totals = SalesCalculationHelper.calculateTotals(dto.lines);
    order.subtotal = totals.subtotal;
    order.taxTotal = totals.taxTotal;
    order.discountTotal = totals.discountTotal;
    order.total = totals.total;

    const savedOrder = await this.salesOrderRepository.save(order);

    // Create lines
    const lines = dto.lines.map(line => {
      const lineTotal = SalesCalculationHelper.calculateLineTotal(line);
      return this.salesOrderLineRepository.create({
        tenantId,
        orderId: savedOrder.id,
        productId: line.productId,
        description: line.description,
        qty: line.qty,
        unitPrice: line.unitPrice,
        discount: line.discount || 0,
        taxRate: line.taxRate || 0,
        total: lineTotal,
      });
    });

    await this.salesOrderLineRepository.save(lines);

    return await this.findOne(tenantId, savedOrder.id);
  }

  async createFromQuote(tenantId: string, quoteId: string, orderNumber: string): Promise<SalesOrder> {
    const quote = await this.salesQuoteRepository.findOne({
      where: { id: quoteId, tenantId },
      relations: ['lines'],
    });

    if (!quote) {
      throw new NotFoundException('Sales quote not found');
    }

    const order = this.salesOrderRepository.create({
      tenantId,
      companyId: quote.companyId,
      contactId: quote.contactId,
      orderNumber,
      status: SalesOrderStatus.DRAFT,
      currency: quote.currency,
      subtotal: quote.subtotal,
      taxTotal: quote.taxTotal,
      discountTotal: quote.discountTotal,
      total: quote.total,
      notes: quote.notes,
    });

    const savedOrder = await this.salesOrderRepository.save(order);

    // Copy lines from quote
    const lines = quote.lines.map(line =>
      this.salesOrderLineRepository.create({
        tenantId,
        orderId: savedOrder.id,
        productId: line.productId,
        description: line.description,
        qty: line.qty,
        unitPrice: line.unitPrice,
        discount: line.discount,
        taxRate: line.taxRate,
        total: line.total,
      }),
    );

    await this.salesOrderLineRepository.save(lines);

    return await this.findOne(tenantId, savedOrder.id);
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: SalesOrderStatus;
      companyId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: SalesOrder[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<SalesOrder> = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    const [data, total] = await this.salesOrderRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['company', 'contact', 'lines'],
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(tenantId: string, id: string): Promise<SalesOrder> {
    const order = await this.salesOrderRepository.findOne({
      where: { id, tenantId },
      relations: ['company', 'contact', 'lines', 'lines.product'],
    });

    if (!order) {
      throw new NotFoundException('Sales order not found');
    }

    return order;
  }

  async update(tenantId: string, id: string, dto: UpdateSalesOrderDto): Promise<SalesOrder> {
    const order = await this.findOne(tenantId, id);

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException('Only draft orders can be updated');
    }

    // Update order fields
    if (dto.companyId) order.companyId = dto.companyId;
    if (dto.contactId) order.contactId = dto.contactId;
    if (dto.orderNumber) order.orderNumber = dto.orderNumber;
    if (dto.currency) order.currency = dto.currency;
    if (dto.notes !== undefined) order.notes = dto.notes;

    // Update lines if provided
    if (dto.lines) {
      // Remove existing lines
      await this.salesOrderLineRepository.delete({ orderId: id });

      // Create new lines
      const totals = SalesCalculationHelper.calculateTotals(dto.lines);
      order.subtotal = totals.subtotal;
      order.taxTotal = totals.taxTotal;
      order.discountTotal = totals.discountTotal;
      order.total = totals.total;

      const lines = dto.lines.map(line => {
        const lineTotal = SalesCalculationHelper.calculateLineTotal(line);
        return this.salesOrderLineRepository.create({
          tenantId,
          orderId: id,
          productId: line.productId,
          description: line.description,
          qty: line.qty,
          unitPrice: line.unitPrice,
          discount: line.discount || 0,
          taxRate: line.taxRate || 0,
          total: lineTotal,
        });
      });

      await this.salesOrderLineRepository.save(lines);
    }

    await this.salesOrderRepository.save(order);

    return await this.findOne(tenantId, id);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const order = await this.findOne(tenantId, id);
    await this.salesOrderRepository.softRemove(order);
  }

  async confirmOrder(tenantId: string, id: string): Promise<SalesOrder> {
    const order = await this.findOne(tenantId, id);

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException('Only draft orders can be confirmed');
    }

    order.status = SalesOrderStatus.CONFIRMED;
    await this.salesOrderRepository.save(order);

    return order;
  }

  async cancelOrder(tenantId: string, id: string): Promise<SalesOrder> {
    const order = await this.findOne(tenantId, id);

    if (order.status === SalesOrderStatus.INVOICED || order.status === SalesOrderStatus.DELIVERED) {
      throw new BadRequestException('Invoiced or delivered orders cannot be cancelled');
    }

    order.status = SalesOrderStatus.CANCELLED;
    await this.salesOrderRepository.save(order);

    return order;
  }
}

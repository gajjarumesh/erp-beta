import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { SalesQuote, SalesQuoteLine, SalesQuoteStatus } from '../../database/entities';
import { CreateSalesQuoteDto, UpdateSalesQuoteDto } from './dto';
import { SalesCalculationHelper } from './sales-calculation.helper';

@Injectable()
export class SalesQuotesService {
  constructor(
    @InjectRepository(SalesQuote)
    private salesQuoteRepository: Repository<SalesQuote>,
    @InjectRepository(SalesQuoteLine)
    private salesQuoteLineRepository: Repository<SalesQuoteLine>,
  ) {}

  async create(tenantId: string, dto: CreateSalesQuoteDto): Promise<SalesQuote> {
    const quote = this.salesQuoteRepository.create({
      tenantId,
      companyId: dto.companyId,
      contactId: dto.contactId || undefined,
      quoteNumber: dto.quoteNumber,
      status: dto.status || SalesQuoteStatus.DRAFT,
      validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      currency: dto.currency || 'USD',
      notes: dto.notes || undefined,
    });

    // Calculate totals
    const totals = SalesCalculationHelper.calculateTotals(dto.lines);
    quote.subtotal = totals.subtotal;
    quote.taxTotal = totals.taxTotal;
    quote.discountTotal = totals.discountTotal;
    quote.total = totals.total;

    const savedQuote = await this.salesQuoteRepository.save(quote);

    // Create lines
    const lines = dto.lines.map(line => {
      const lineTotal = SalesCalculationHelper.calculateLineTotal(line);
      return this.salesQuoteLineRepository.create({
        tenantId,
        quoteId: savedQuote.id,
        productId: line.productId,
        description: line.description,
        qty: line.qty,
        unitPrice: line.unitPrice,
        discount: line.discount || 0,
        taxRate: line.taxRate || 0,
        total: lineTotal,
      });
    });

    await this.salesQuoteLineRepository.save(lines);

    return await this.findOne(tenantId, savedQuote.id);
  }

  async findAll(
    tenantId: string,
    filters?: {
      status?: SalesQuoteStatus;
      companyId?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{ data: SalesQuote[]; total: number; page: number; limit: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<SalesQuote> = { tenantId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    const [data, total] = await this.salesQuoteRepository.findAndCount({
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

  async findOne(tenantId: string, id: string): Promise<SalesQuote> {
    const quote = await this.salesQuoteRepository.findOne({
      where: { id, tenantId },
      relations: ['company', 'contact', 'lines', 'lines.product'],
    });

    if (!quote) {
      throw new NotFoundException('Sales quote not found');
    }

    return quote;
  }

  async update(tenantId: string, id: string, dto: UpdateSalesQuoteDto): Promise<SalesQuote> {
    const quote = await this.findOne(tenantId, id);

    if (quote.status !== SalesQuoteStatus.DRAFT) {
      throw new BadRequestException('Only draft quotes can be updated');
    }

    // Update quote fields
    if (dto.companyId) quote.companyId = dto.companyId;
    if (dto.contactId) quote.contactId = dto.contactId;
    if (dto.quoteNumber) quote.quoteNumber = dto.quoteNumber;
    if (dto.validUntil) quote.validUntil = new Date(dto.validUntil);
    if (dto.currency) quote.currency = dto.currency;
    if (dto.notes !== undefined) quote.notes = dto.notes;

    // Update lines if provided
    if (dto.lines) {
      // Remove existing lines
      await this.salesQuoteLineRepository.delete({ quoteId: id });

      // Create new lines
      const totals = SalesCalculationHelper.calculateTotals(dto.lines);
      quote.subtotal = totals.subtotal;
      quote.taxTotal = totals.taxTotal;
      quote.discountTotal = totals.discountTotal;
      quote.total = totals.total;

      const lines = dto.lines.map(line => {
        const lineTotal = SalesCalculationHelper.calculateLineTotal(line);
        return this.salesQuoteLineRepository.create({
          tenantId,
          quoteId: id,
          productId: line.productId,
          description: line.description,
          qty: line.qty,
          unitPrice: line.unitPrice,
          discount: line.discount || 0,
          taxRate: line.taxRate || 0,
          total: lineTotal,
        });
      });

      await this.salesQuoteLineRepository.save(lines);
    }

    await this.salesQuoteRepository.save(quote);

    return await this.findOne(tenantId, id);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const quote = await this.findOne(tenantId, id);
    await this.salesQuoteRepository.softRemove(quote);
  }

  async sendQuote(tenantId: string, id: string): Promise<SalesQuote> {
    const quote = await this.findOne(tenantId, id);

    if (quote.status !== SalesQuoteStatus.DRAFT) {
      throw new BadRequestException('Only draft quotes can be sent');
    }

    quote.status = SalesQuoteStatus.SENT;
    await this.salesQuoteRepository.save(quote);

    return quote;
  }

  async acceptQuote(tenantId: string, id: string): Promise<SalesQuote> {
    const quote = await this.findOne(tenantId, id);

    if (quote.status !== SalesQuoteStatus.SENT) {
      throw new BadRequestException('Only sent quotes can be accepted');
    }

    quote.status = SalesQuoteStatus.ACCEPTED;
    await this.salesQuoteRepository.save(quote);

    return quote;
  }

  async rejectQuote(tenantId: string, id: string): Promise<SalesQuote> {
    const quote = await this.findOne(tenantId, id);

    if (quote.status !== SalesQuoteStatus.SENT) {
      throw new BadRequestException('Only sent quotes can be rejected');
    }

    quote.status = SalesQuoteStatus.REJECTED;
    await this.salesQuoteRepository.save(quote);

    return quote;
  }
}

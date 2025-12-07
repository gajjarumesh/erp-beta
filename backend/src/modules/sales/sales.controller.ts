import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { SalesQuotesService, SalesOrdersService } from './';
import {
  CreateSalesQuoteDto,
  UpdateSalesQuoteDto,
  CreateSalesOrderDto,
  UpdateSalesOrderDto,
} from './dto';
import { SalesQuoteStatus, SalesOrderStatus } from '../../database/entities';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(
    private readonly salesQuotesService: SalesQuotesService,
    private readonly salesOrdersService: SalesOrdersService,
  ) {}

  // ==================== QUOTES ====================
  @Post('quotes')
  @ApiOperation({ summary: 'Create a new sales quote' })
  @RequirePermissions('sales:quote:create')
  async createQuote(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateSalesQuoteDto) {
    const quote = await this.salesQuotesService.create(tenantId, dto);
    return { success: true, data: quote };
  }

  @Get('quotes')
  @ApiOperation({ summary: 'List all sales quotes' })
  @ApiQuery({ name: 'status', enum: SalesQuoteStatus, required: false })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('sales:quote:read')
  async listQuotes(
    @CurrentUser('tenantId') tenantId: string,
    @Query('status') status?: SalesQuoteStatus,
    @Query('companyId') companyId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.salesQuotesService.findAll(tenantId, {
      status,
      companyId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('quotes/:id')
  @ApiOperation({ summary: 'Get quote by ID' })
  @RequirePermissions('sales:quote:read')
  async getQuote(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const quote = await this.salesQuotesService.findOne(tenantId, id);
    return { success: true, data: quote };
  }

  @Put('quotes/:id')
  @ApiOperation({ summary: 'Update quote' })
  @RequirePermissions('sales:quote:update')
  async updateQuote(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSalesQuoteDto,
  ) {
    const quote = await this.salesQuotesService.update(tenantId, id, dto);
    return { success: true, data: quote };
  }

  @Delete('quotes/:id')
  @ApiOperation({ summary: 'Delete quote' })
  @RequirePermissions('sales:quote:delete')
  async deleteQuote(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.salesQuotesService.remove(tenantId, id);
    return { success: true, message: 'Quote deleted successfully' };
  }

  @Post('quotes/:id/send')
  @ApiOperation({ summary: 'Send quote to customer' })
  @RequirePermissions('sales:quote:update')
  async sendQuote(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const quote = await this.salesQuotesService.sendQuote(tenantId, id);
    return { success: true, data: quote };
  }

  @Post('quotes/:id/accept')
  @ApiOperation({ summary: 'Accept quote' })
  @RequirePermissions('sales:quote:update')
  async acceptQuote(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const quote = await this.salesQuotesService.acceptQuote(tenantId, id);
    return { success: true, data: quote };
  }

  @Post('quotes/:id/reject')
  @ApiOperation({ summary: 'Reject quote' })
  @RequirePermissions('sales:quote:update')
  async rejectQuote(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const quote = await this.salesQuotesService.rejectQuote(tenantId, id);
    return { success: true, data: quote };
  }

  // ==================== ORDERS ====================
  @Post('orders')
  @ApiOperation({ summary: 'Create a new sales order' })
  @RequirePermissions('sales:order:create')
  async createOrder(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateSalesOrderDto) {
    const order = await this.salesOrdersService.create(tenantId, dto);
    return { success: true, data: order };
  }

  @Post('orders/from-quote/:quoteId')
  @ApiOperation({ summary: 'Create sales order from quote' })
  @RequirePermissions('sales:order:create')
  async createOrderFromQuote(
    @CurrentUser('tenantId') tenantId: string,
    @Param('quoteId') quoteId: string,
    @Body('orderNumber') orderNumber: string,
  ) {
    const order = await this.salesOrdersService.createFromQuote(tenantId, quoteId, orderNumber);
    return { success: true, data: order };
  }

  @Get('orders')
  @ApiOperation({ summary: 'List all sales orders' })
  @ApiQuery({ name: 'status', enum: SalesOrderStatus, required: false })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('sales:order:read')
  async listOrders(
    @CurrentUser('tenantId') tenantId: string,
    @Query('status') status?: SalesOrderStatus,
    @Query('companyId') companyId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.salesOrdersService.findAll(tenantId, {
      status,
      companyId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  @RequirePermissions('sales:order:read')
  async getOrder(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const order = await this.salesOrdersService.findOne(tenantId, id);
    return { success: true, data: order };
  }

  @Put('orders/:id')
  @ApiOperation({ summary: 'Update order' })
  @RequirePermissions('sales:order:update')
  async updateOrder(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSalesOrderDto,
  ) {
    const order = await this.salesOrdersService.update(tenantId, id, dto);
    return { success: true, data: order };
  }

  @Delete('orders/:id')
  @ApiOperation({ summary: 'Delete order' })
  @RequirePermissions('sales:order:delete')
  async deleteOrder(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.salesOrdersService.remove(tenantId, id);
    return { success: true, message: 'Order deleted successfully' };
  }

  @Post('orders/:id/confirm')
  @ApiOperation({ summary: 'Confirm order' })
  @RequirePermissions('sales:order:update')
  async confirmOrder(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const order = await this.salesOrdersService.confirmOrder(tenantId, id);
    return { success: true, data: order };
  }

  @Post('orders/:id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @RequirePermissions('sales:order:update')
  async cancelOrder(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const order = await this.salesOrdersService.cancelOrder(tenantId, id);
    return { success: true, data: order };
  }
}

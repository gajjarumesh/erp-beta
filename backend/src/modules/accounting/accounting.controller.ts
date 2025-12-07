import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { AccountsService } from './accounts.service';
import { JournalEntriesService } from './journal-entries.service';
import { InvoicesService } from './invoices.service';
import { PaymentsService } from './payments.service';
import { BankReconciliationService } from './bank-reconciliation.service';
import { TaxRulesService } from './tax-rules.service';
import { FinancialReportsService } from './financial-reports.service';
import {
  CreateAccountDto,
  UpdateAccountDto,
  CreateJournalEntryDto,
  UpdateJournalEntryDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  GenerateInvoiceFromOrderDto,
  CreatePaymentDto,
  UpdatePaymentDto,
  CreateBankAccountDto,
  UpdateBankAccountDto,
  ImportBankTransactionDto,
  MatchBankTransactionDto,
  CreateTaxRuleDto,
  UpdateTaxRuleDto,
  FinancialReportFilterDto,
} from './dto';
import { AccountType, InvoiceStatus, InvoiceType, BankTransactionStatus } from '../../database/entities';

@ApiTags('Accounting')
@ApiBearerAuth()
@Controller('accounting')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AccountingController {
  constructor(
    private accountsService: AccountsService,
    private journalEntriesService: JournalEntriesService,
    private invoicesService: InvoicesService,
    private paymentsService: PaymentsService,
    private bankReconciliationService: BankReconciliationService,
    private taxRulesService: TaxRulesService,
    private financialReportsService: FinancialReportsService,
  ) {}

  // ============ CHART OF ACCOUNTS ============
  @Post('accounts')
  @RequirePermissions('accounting:account:create')
  @ApiOperation({ summary: 'Create a new account' })
  createAccount(@Request() req: any, @Body() createDto: CreateAccountDto) {
    return this.accountsService.create(req.user.tenantId, createDto);
  }

  @Get('accounts')
  @RequirePermissions('accounting:account:read')
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiQuery({ name: 'type', enum: AccountType, required: false })
  findAllAccounts(@Request() req: any, @Query('type') type?: AccountType) {
    return this.accountsService.findAll(req.user.tenantId, type);
  }

  @Get('accounts/chart')
  @RequirePermissions('accounting:account:read')
  @ApiOperation({ summary: 'Get chart of accounts' })
  getChartOfAccounts(@Request() req: any) {
    return this.accountsService.getChartOfAccounts(req.user.tenantId);
  }

  @Get('accounts/:id')
  @RequirePermissions('accounting:account:read')
  @ApiOperation({ summary: 'Get account by ID' })
  findOneAccount(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  @Put('accounts/:id')
  @RequirePermissions('accounting:account:update')
  @ApiOperation({ summary: 'Update account' })
  updateAccount(@Param('id') id: string, @Body() updateDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateDto);
  }

  @Delete('accounts/:id')
  @RequirePermissions('accounting:account:delete')
  @ApiOperation({ summary: 'Delete account' })
  removeAccount(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }

  // ============ JOURNAL ENTRIES ============
  @Post('journal-entries')
  @RequirePermissions('accounting:journal:create')
  @ApiOperation({ summary: 'Create a new journal entry' })
  createJournalEntry(@Request() req: any, @Body() createDto: CreateJournalEntryDto) {
    return this.journalEntriesService.create(req.user.tenantId, req.user.userId, createDto);
  }

  @Get('journal-entries')
  @RequirePermissions('accounting:journal:read')
  @ApiOperation({ summary: 'Get all journal entries' })
  findAllJournalEntries(@Request() req: any) {
    return this.journalEntriesService.findAll(req.user.tenantId);
  }

  @Get('journal-entries/:id')
  @RequirePermissions('accounting:journal:read')
  @ApiOperation({ summary: 'Get journal entry by ID' })
  findOneJournalEntry(@Param('id') id: string) {
    return this.journalEntriesService.findOne(id);
  }

  @Put('journal-entries/:id')
  @RequirePermissions('accounting:journal:update')
  @ApiOperation({ summary: 'Update journal entry' })
  updateJournalEntry(@Param('id') id: string, @Body() updateDto: UpdateJournalEntryDto) {
    return this.journalEntriesService.update(id, updateDto);
  }

  @Post('journal-entries/:id/post')
  @RequirePermissions('accounting:journal:update')
  @ApiOperation({ summary: 'Post journal entry' })
  postJournalEntry(@Param('id') id: string) {
    return this.journalEntriesService.post(id);
  }

  @Delete('journal-entries/:id')
  @RequirePermissions('accounting:journal:delete')
  @ApiOperation({ summary: 'Delete journal entry' })
  removeJournalEntry(@Param('id') id: string) {
    return this.journalEntriesService.remove(id);
  }

  // ============ INVOICES ============
  @Post('invoices')
  @RequirePermissions('accounting:invoice:create')
  @ApiOperation({ summary: 'Create a new invoice' })
  createInvoice(@Request() req: any, @Body() createDto: CreateInvoiceDto) {
    return this.invoicesService.create(req.user.tenantId, req.user.userId, createDto);
  }

  @Post('invoices/from-order/:orderId')
  @RequirePermissions('accounting:invoice:create')
  @ApiOperation({ summary: 'Generate invoice from sales order' })
  generateInvoiceFromOrder(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Body() generateDto: GenerateInvoiceFromOrderDto,
  ) {
    return this.invoicesService.generateFromSalesOrder(
      orderId,
      req.user.tenantId,
      req.user.userId,
      generateDto,
    );
  }

  @Get('invoices')
  @RequirePermissions('accounting:invoice:read')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false })
  @ApiQuery({ name: 'type', enum: InvoiceType, required: false })
  findAllInvoices(
    @Request() req: any,
    @Query('status') status?: InvoiceStatus,
    @Query('type') type?: InvoiceType,
  ) {
    return this.invoicesService.findAll(req.user.tenantId, status, type);
  }

  @Get('invoices/:id')
  @RequirePermissions('accounting:invoice:read')
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOneInvoice(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Put('invoices/:id')
  @RequirePermissions('accounting:invoice:update')
  @ApiOperation({ summary: 'Update invoice' })
  updateInvoice(@Param('id') id: string, @Body() updateDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateDto);
  }

  @Post('invoices/:id/send')
  @RequirePermissions('accounting:invoice:update')
  @ApiOperation({ summary: 'Send invoice' })
  sendInvoice(@Request() req: any, @Param('id') id: string) {
    return this.invoicesService.send(id, req.user.userId);
  }

  @Post('invoices/:id/mark-paid')
  @RequirePermissions('accounting:invoice:update')
  @ApiOperation({ summary: 'Mark invoice as paid' })
  markInvoiceAsPaid(@Param('id') id: string) {
    return this.invoicesService.markAsPaid(id);
  }

  @Post('invoices/:id/cancel')
  @RequirePermissions('accounting:invoice:update')
  @ApiOperation({ summary: 'Cancel invoice' })
  cancelInvoice(@Param('id') id: string) {
    return this.invoicesService.cancel(id);
  }

  @Delete('invoices/:id')
  @RequirePermissions('accounting:invoice:delete')
  @ApiOperation({ summary: 'Delete invoice' })
  removeInvoice(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }

  // ============ PAYMENTS ============
  @Post('payments')
  @RequirePermissions('accounting:payment:create')
  @ApiOperation({ summary: 'Create a new payment' })
  createPayment(@Request() req: any, @Body() createDto: CreatePaymentDto) {
    return this.paymentsService.create(req.user.tenantId, req.user.userId, createDto);
  }

  @Get('payments')
  @RequirePermissions('accounting:payment:read')
  @ApiOperation({ summary: 'Get all payments' })
  @ApiQuery({ name: 'invoiceId', required: false })
  findAllPayments(@Request() req: any, @Query('invoiceId') invoiceId?: string) {
    return this.paymentsService.findAll(req.user.tenantId, invoiceId);
  }

  @Get('payments/:id')
  @RequirePermissions('accounting:payment:read')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOnePayment(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Put('payments/:id')
  @RequirePermissions('accounting:payment:update')
  @ApiOperation({ summary: 'Update payment' })
  updatePayment(@Param('id') id: string, @Body() updateDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updateDto);
  }

  @Delete('payments/:id')
  @RequirePermissions('accounting:payment:delete')
  @ApiOperation({ summary: 'Delete payment' })
  removePayment(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }

  // ============ BANK ACCOUNTS ============
  @Post('bank-accounts')
  @RequirePermissions('accounting:bank:create')
  @ApiOperation({ summary: 'Create a new bank account' })
  createBankAccount(@Request() req: any, @Body() createDto: CreateBankAccountDto) {
    return this.bankReconciliationService.createBankAccount(req.user.tenantId, createDto);
  }

  @Get('bank-accounts')
  @RequirePermissions('accounting:bank:read')
  @ApiOperation({ summary: 'Get all bank accounts' })
  findAllBankAccounts(@Request() req: any) {
    return this.bankReconciliationService.findAllBankAccounts(req.user.tenantId);
  }

  @Get('bank-accounts/:id')
  @RequirePermissions('accounting:bank:read')
  @ApiOperation({ summary: 'Get bank account by ID' })
  findOneBankAccount(@Param('id') id: string) {
    return this.bankReconciliationService.findOneBankAccount(id);
  }

  @Put('bank-accounts/:id')
  @RequirePermissions('accounting:bank:update')
  @ApiOperation({ summary: 'Update bank account' })
  updateBankAccount(@Param('id') id: string, @Body() updateDto: UpdateBankAccountDto) {
    return this.bankReconciliationService.updateBankAccount(id, updateDto);
  }

  @Delete('bank-accounts/:id')
  @RequirePermissions('accounting:bank:delete')
  @ApiOperation({ summary: 'Delete bank account' })
  removeBankAccount(@Param('id') id: string) {
    return this.bankReconciliationService.removeBankAccount(id);
  }

  // ============ BANK TRANSACTIONS ============
  @Post('bank-transactions/import')
  @RequirePermissions('accounting:bank:create')
  @ApiOperation({ summary: 'Import bank transaction' })
  importBankTransaction(@Body() importDto: ImportBankTransactionDto) {
    return this.bankReconciliationService.importBankTransaction(importDto);
  }

  @Post('bank-transactions/import-batch')
  @RequirePermissions('accounting:bank:create')
  @ApiOperation({ summary: 'Import multiple bank transactions' })
  importBankTransactionsBatch(@Body() transactions: ImportBankTransactionDto[]) {
    return this.bankReconciliationService.importBankTransactionsBatch(transactions);
  }

  @Get('bank-transactions')
  @RequirePermissions('accounting:bank:read')
  @ApiOperation({ summary: 'Get bank transactions' })
  @ApiQuery({ name: 'bankAccountId', required: true })
  @ApiQuery({ name: 'status', enum: BankTransactionStatus, required: false })
  findAllBankTransactions(
    @Query('bankAccountId') bankAccountId: string,
    @Query('status') status?: BankTransactionStatus,
  ) {
    return this.bankReconciliationService.findAllBankTransactions(bankAccountId, status);
  }

  @Get('bank-transactions/:id')
  @RequirePermissions('accounting:bank:read')
  @ApiOperation({ summary: 'Get bank transaction by ID' })
  findOneBankTransaction(@Param('id') id: string) {
    return this.bankReconciliationService.findOneBankTransaction(id);
  }

  @Post('bank-transactions/match')
  @RequirePermissions('accounting:bank:update')
  @ApiOperation({ summary: 'Match bank transaction to invoice' })
  matchBankTransaction(@Body() matchDto: MatchBankTransactionDto) {
    return this.bankReconciliationService.matchTransaction(matchDto);
  }

  @Post('bank-transactions/:id/unmatch')
  @RequirePermissions('accounting:bank:update')
  @ApiOperation({ summary: 'Unmatch bank transaction' })
  unmatchBankTransaction(@Param('id') id: string) {
    return this.bankReconciliationService.unmatchTransaction(id);
  }

  @Post('bank-transactions/:id/reconcile')
  @RequirePermissions('accounting:bank:update')
  @ApiOperation({ summary: 'Reconcile bank transaction' })
  reconcileBankTransaction(@Param('id') id: string) {
    return this.bankReconciliationService.reconcileTransaction(id);
  }

  @Get('bank-transactions/:id/suggest-matches')
  @RequirePermissions('accounting:bank:read')
  @ApiOperation({ summary: 'Get suggested matches for bank transaction' })
  suggestMatches(@Param('id') id: string) {
    return this.bankReconciliationService.suggestMatches(id);
  }

  // ============ TAX RULES ============
  @Post('tax-rules')
  @RequirePermissions('accounting:tax:create')
  @ApiOperation({ summary: 'Create a new tax rule' })
  createTaxRule(@Request() req: any, @Body() createDto: CreateTaxRuleDto) {
    return this.taxRulesService.create(req.user.tenantId, createDto);
  }

  @Get('tax-rules')
  @RequirePermissions('accounting:tax:read')
  @ApiOperation({ summary: 'Get all tax rules' })
  @ApiQuery({ name: 'activeOnly', type: Boolean, required: false })
  findAllTaxRules(@Request() req: any, @Query('activeOnly') activeOnly?: boolean) {
    return this.taxRulesService.findAll(req.user.tenantId, activeOnly === true);
  }

  @Get('tax-rules/:id')
  @RequirePermissions('accounting:tax:read')
  @ApiOperation({ summary: 'Get tax rule by ID' })
  findOneTaxRule(@Param('id') id: string) {
    return this.taxRulesService.findOne(id);
  }

  @Put('tax-rules/:id')
  @RequirePermissions('accounting:tax:update')
  @ApiOperation({ summary: 'Update tax rule' })
  updateTaxRule(@Param('id') id: string, @Body() updateDto: UpdateTaxRuleDto) {
    return this.taxRulesService.update(id, updateDto);
  }

  @Delete('tax-rules/:id')
  @RequirePermissions('accounting:tax:delete')
  @ApiOperation({ summary: 'Delete tax rule' })
  removeTaxRule(@Param('id') id: string) {
    return this.taxRulesService.remove(id);
  }

  // ============ FINANCIAL REPORTS ============
  @Get('reports/balance-sheet')
  @RequirePermissions('accounting:report:read')
  @ApiOperation({ summary: 'Get balance sheet report' })
  getBalanceSheet(@Request() req: any, @Query() filters: FinancialReportFilterDto) {
    return this.financialReportsService.getBalanceSheet(req.user.tenantId, filters);
  }

  @Get('reports/profit-loss')
  @RequirePermissions('accounting:report:read')
  @ApiOperation({ summary: 'Get profit and loss report' })
  getProfitAndLoss(@Request() req: any, @Query() filters: FinancialReportFilterDto) {
    return this.financialReportsService.getProfitAndLoss(req.user.tenantId, filters);
  }

  @Get('reports/trial-balance')
  @RequirePermissions('accounting:report:read')
  @ApiOperation({ summary: 'Get trial balance report' })
  getTrialBalance(@Request() req: any, @Query() filters: FinancialReportFilterDto) {
    return this.financialReportsService.getTrialBalance(req.user.tenantId, filters);
  }
}

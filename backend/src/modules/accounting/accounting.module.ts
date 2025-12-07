import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Account,
  JournalEntry,
  JournalEntryLine,
  Invoice,
  InvoiceLine,
  Payment,
  BankAccount,
  BankTransaction,
  TaxRule,
  SalesOrder,
} from '../../database/entities';
import { AccountsService } from './accounts.service';
import { JournalEntriesService } from './journal-entries.service';
import { InvoicesService } from './invoices.service';
import { PaymentsService } from './payments.service';
import { BankReconciliationService } from './bank-reconciliation.service';
import { TaxRulesService } from './tax-rules.service';
import { FinancialReportsService } from './financial-reports.service';
import { AccountingController } from './accounting.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      JournalEntry,
      JournalEntryLine,
      Invoice,
      InvoiceLine,
      Payment,
      BankAccount,
      BankTransaction,
      TaxRule,
      SalesOrder,
    ]),
  ],
  controllers: [AccountingController],
  providers: [
    AccountsService,
    JournalEntriesService,
    InvoicesService,
    PaymentsService,
    BankReconciliationService,
    TaxRulesService,
    FinancialReportsService,
  ],
  exports: [
    AccountsService,
    JournalEntriesService,
    InvoicesService,
    PaymentsService,
    BankReconciliationService,
    TaxRulesService,
    FinancialReportsService,
  ],
})
export class AccountingModule {}

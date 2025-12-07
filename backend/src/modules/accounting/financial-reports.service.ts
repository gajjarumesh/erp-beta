import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { Account, AccountType, JournalEntryLine } from '../../database/entities';
import { FinancialReportFilterDto } from './dto';

interface AccountBalance {
  accountId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debit: number;
  credit: number;
  balance: number;
}

interface BalanceSheetData {
  assets: AccountBalance[];
  liabilities: AccountBalance[];
  equity: AccountBalance[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

interface ProfitLossData {
  income: AccountBalance[];
  expenses: AccountBalance[];
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

@Injectable()
export class FinancialReportsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(JournalEntryLine)
    private journalEntryLinesRepository: Repository<JournalEntryLine>,
  ) {}

  async getBalanceSheet(
    tenantId: string,
    filters: FinancialReportFilterDto,
  ): Promise<BalanceSheetData> {
    const balances = await this.calculateAccountBalances(tenantId, filters);

    // Group by account type
    const assets = balances.filter((b) => b.accountType === AccountType.ASSET);
    const liabilities = balances.filter((b) => b.accountType === AccountType.LIABILITY);
    const equity = balances.filter((b) => b.accountType === AccountType.EQUITY);

    const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
    const totalEquity = equity.reduce((sum, e) => sum + e.balance, 0);

    return {
      assets,
      liabilities,
      equity,
      totalAssets,
      totalLiabilities,
      totalEquity,
    };
  }

  async getProfitAndLoss(
    tenantId: string,
    filters: FinancialReportFilterDto,
  ): Promise<ProfitLossData> {
    const balances = await this.calculateAccountBalances(tenantId, filters);

    // Group by account type
    const income = balances.filter((b) => b.accountType === AccountType.INCOME);
    const expenses = balances.filter((b) => b.accountType === AccountType.EXPENSE);

    const totalIncome = income.reduce((sum, i) => sum + Math.abs(i.balance), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Math.abs(e.balance), 0);
    const netProfit = totalIncome - totalExpenses;

    return {
      income,
      expenses,
      totalIncome,
      totalExpenses,
      netProfit,
    };
  }

  async getTrialBalance(
    tenantId: string,
    filters: FinancialReportFilterDto,
  ): Promise<AccountBalance[]> {
    return this.calculateAccountBalances(tenantId, filters);
  }

  private async calculateAccountBalances(
    tenantId: string,
    filters: FinancialReportFilterDto,
  ): Promise<AccountBalance[]> {
    const accounts = await this.accountsRepository.find({
      where: { tenantId, deletedAt: IsNull() },
    });

    const balances: AccountBalance[] = [];

    for (const account of accounts) {
      const whereConditions: any = {
        accountId: account.id,
      };

      // Build date filter query
      let dateFilter = '';
      const params: any[] = [account.id, tenantId];
      let paramIndex = 3;

      if (filters.from || filters.to) {
        const joinQuery = `
          INNER JOIN journal_entries je ON je.id = journal_entry_lines.entry_id
          WHERE journal_entry_lines.account_id = $1
            AND je.tenant_id = $2
            AND je.deleted_at IS NULL
            AND je.is_posted = true
        `;

        if (filters.from && filters.to) {
          dateFilter = `${joinQuery} AND je.date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
          params.push(filters.from, filters.to);
        } else if (filters.from) {
          dateFilter = `${joinQuery} AND je.date >= $${paramIndex}`;
          params.push(filters.from);
        } else if (filters.to) {
          dateFilter = `${joinQuery} AND je.date <= $${paramIndex}`;
          params.push(filters.to);
        }
      } else {
        dateFilter = `
          INNER JOIN journal_entries je ON je.id = journal_entry_lines.entry_id
          WHERE journal_entry_lines.account_id = $1
            AND je.tenant_id = $2
            AND je.deleted_at IS NULL
            AND je.is_posted = true
        `;
      }

      const query = `
        SELECT 
          COALESCE(SUM(debit), 0) as total_debit,
          COALESCE(SUM(credit), 0) as total_credit
        FROM journal_entry_lines
        ${dateFilter}
      `;

      const result = await this.journalEntryLinesRepository.query(query, params);
      
      const debit = parseFloat(result[0]?.total_debit || 0);
      const credit = parseFloat(result[0]?.total_credit || 0);

      // Calculate balance based on account type
      let balance = 0;
      if (account.type === AccountType.ASSET || account.type === AccountType.EXPENSE) {
        balance = debit - credit;
      } else {
        balance = credit - debit;
      }

      balances.push({
        accountId: account.id,
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        debit,
        credit,
        balance,
      });
    }

    return balances.filter((b) => Math.abs(b.balance) > 0.01); // Filter out zero balances
  }

  async getAccountingPeriodSummary(
    tenantId: string,
    from: Date,
    to: Date,
  ): Promise<any> {
    const pl = await this.getProfitAndLoss(tenantId, { from, to });
    const bs = await this.getBalanceSheet(tenantId, { from, to });

    return {
      period: { from, to },
      profitLoss: pl,
      balanceSheet: bs,
    };
  }
}

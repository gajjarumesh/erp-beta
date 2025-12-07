import { Tenant } from './tenant.entity';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Settings, SettingsScope } from './settings.entity';
import { AuditLog } from './audit-log.entity';
import { File } from './file.entity';
import { Notification, NotificationType, NotificationStatus } from './notification.entity';
import { Company, CompanyType } from './company.entity';
import { Contact } from './contact.entity';
import { Lead, LeadStatus, LeadSource } from './lead.entity';
import { Opportunity } from './opportunity.entity';
import { Pipeline } from './pipeline.entity';
import { Stage } from './stage.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { PriceRule } from './price-rule.entity';
import { SalesQuote, SalesQuoteStatus } from './sales-quote.entity';
import { SalesQuoteLine } from './sales-quote-line.entity';
import { SalesOrder, SalesOrderStatus } from './sales-order.entity';
import { SalesOrderLine } from './sales-order-line.entity';
import { Account, AccountType } from './account.entity';
import { JournalEntry } from './journal-entry.entity';
import { JournalEntryLine } from './journal-entry-line.entity';
import { Invoice, InvoiceType, InvoiceStatus } from './invoice.entity';
import { InvoiceLine } from './invoice-line.entity';
import { Payment, PaymentMethod } from './payment.entity';
import { BankAccount } from './bank-account.entity';
import { BankTransaction, BankTransactionStatus } from './bank-transaction.entity';
import { TaxRule, TaxType } from './tax-rule.entity';
import { Employee, EmployeeStatus } from './employee.entity';
import { AttendanceLog, AttendanceSource } from './attendance-log.entity';
import { LeaveRequest, LeaveType, LeaveStatus } from './leave-request.entity';
import { ExpenseClaim, ExpenseStatus } from './expense-claim.entity';
import { PayrollConfig, PayrollCycle } from './payroll-config.entity';
import { Payslip, PayslipStatus } from './payslip.entity';
import { Project, ProjectStatus } from './project.entity';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { TaskComment } from './task-comment.entity';
import { Timesheet } from './timesheet.entity';
import { Ticket, TicketPriority, TicketStatus } from './ticket.entity';
import { TicketComment } from './ticket-comment.entity';
import { SlaRule } from './sla-rule.entity';
import { PosSession, PosSessionStatus } from './pos-session.entity';
import { PosTransaction, PosPaymentMethod } from './pos-transaction.entity';
import { SavedReport } from './saved-report.entity';
import { DashboardWidget } from './dashboard-widget.entity';
import { WorkflowRule } from './workflow-rule.entity';
import { WorkflowLog, WorkflowLogStatus } from './workflow-log.entity';
import { Integration, IntegrationType, IntegrationStatus } from './integration.entity';
import { WebhookSubscription } from './webhook-subscription.entity';
import { Plugin } from './plugin.entity';
import { PluginConfig } from './plugin-config.entity';

// Export entities
export { 
  Tenant, 
  User, 
  Role, 
  Permission, 
  Settings, 
  SettingsScope, 
  AuditLog, 
  File, 
  Notification, 
  NotificationType, 
  NotificationStatus,
  Company,
  CompanyType,
  Contact,
  Lead,
  LeadStatus,
  LeadSource,
  Opportunity,
  Pipeline,
  Stage,
  Product,
  ProductVariant,
  PriceRule,
  SalesQuote,
  SalesQuoteStatus,
  SalesQuoteLine,
  SalesOrder,
  SalesOrderStatus,
  SalesOrderLine,
  Account,
  AccountType,
  JournalEntry,
  JournalEntryLine,
  Invoice,
  InvoiceType,
  InvoiceStatus,
  InvoiceLine,
  Payment,
  PaymentMethod,
  BankAccount,
  BankTransaction,
  BankTransactionStatus,
  TaxRule,
  TaxType,
  Employee,
  EmployeeStatus,
  AttendanceLog,
  AttendanceSource,
  LeaveRequest,
  LeaveType,
  LeaveStatus,
  ExpenseClaim,
  ExpenseStatus,
  PayrollConfig,
  PayrollCycle,
  Payslip,
  PayslipStatus,
  Project,
  ProjectStatus,
  Task,
  TaskStatus,
  TaskPriority,
  TaskComment,
  Timesheet,
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketComment,
  SlaRule,
  PosSession,
  PosSessionStatus,
  PosTransaction,
  PosPaymentMethod,
  SavedReport,
  DashboardWidget,
  WorkflowRule,
  WorkflowLog,
  WorkflowLogStatus,
  Integration,
  IntegrationType,
  IntegrationStatus,
  WebhookSubscription,
  Plugin,
  PluginConfig,
};

// Entity array for TypeORM (excluding enums)
export const entities = [
  Tenant,
  User,
  Role,
  Permission,
  Settings,
  AuditLog,
  File,
  Notification,
  Company,
  Contact,
  Lead,
  Opportunity,
  Pipeline,
  Stage,
  Product,
  ProductVariant,
  PriceRule,
  SalesQuote,
  SalesQuoteLine,
  SalesOrder,
  SalesOrderLine,
  Account,
  JournalEntry,
  JournalEntryLine,
  Invoice,
  InvoiceLine,
  Payment,
  BankAccount,
  BankTransaction,
  TaxRule,
  Employee,
  AttendanceLog,
  LeaveRequest,
  ExpenseClaim,
  PayrollConfig,
  Payslip,
  Project,
  Task,
  TaskComment,
  Timesheet,
  Ticket,
  TicketComment,
  SlaRule,
  PosSession,
  PosTransaction,
  SavedReport,
  DashboardWidget,
  WorkflowRule,
  WorkflowLog,
  Integration,
  WebhookSubscription,
  Plugin,
  PluginConfig,
];


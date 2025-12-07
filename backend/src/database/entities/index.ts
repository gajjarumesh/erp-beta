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
];


import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SavedReport } from '../../database/entities';
import { CreateSavedReportDto, UpdateSavedReportDto, ExecuteReportDto } from './dto/saved-report.dto';

@Injectable()
export class SavedReportsService {
  constructor(
    @InjectRepository(SavedReport)
    private readonly savedReportRepository: Repository<SavedReport>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDto: CreateSavedReportDto, userId: string): Promise<SavedReport> {
    // Check if slug already exists
    const existing = await this.savedReportRepository.findOne({
      where: { slug: createDto.slug },
    });

    if (existing) {
      throw new ConflictException(`Report with slug '${createDto.slug}' already exists`);
    }

    const report = this.savedReportRepository.create({
      ...createDto,
      createdBy: userId,
    });

    return this.savedReportRepository.save(report);
  }

  async findAll(category?: string, isActive?: boolean): Promise<SavedReport[]> {
    const query = this.savedReportRepository.createQueryBuilder('report');

    if (category) {
      query.andWhere('report.category = :category', { category });
    }

    if (isActive !== undefined) {
      query.andWhere('report.isActive = :isActive', { isActive });
    }

    query.orderBy('report.category', 'ASC').addOrderBy('report.name', 'ASC');

    return query.getMany();
  }

  async findOne(slug: string): Promise<SavedReport> {
    const report = await this.savedReportRepository.findOne({
      where: { slug },
    });

    if (!report) {
      throw new NotFoundException(`Report with slug '${slug}' not found`);
    }

    return report;
  }

  async update(slug: string, updateDto: UpdateSavedReportDto): Promise<SavedReport> {
    const report = await this.findOne(slug);

    Object.assign(report, updateDto);

    return this.savedReportRepository.save(report);
  }

  async remove(slug: string): Promise<void> {
    const report = await this.findOne(slug);
    await this.savedReportRepository.remove(report);
  }

  async execute(slug: string, executeDto: ExecuteReportDto): Promise<any> {
    const report = await this.findOne(slug);

    if (!report.isActive) {
      throw new ConflictException('Report is not active');
    }

    // Execute report based on configuration
    // This is a simplified implementation that uses predefined report types
    const reportType = report.config.type || report.slug;

    switch (reportType) {
      case 'revenue-by-month':
        return this.executeRevenueByMonth(executeDto.params);
      case 'top-customers':
        return this.executeTopCustomers(executeDto.params);
      case 'inventory-valuation':
        return this.executeInventoryValuation(executeDto.params);
      case 'timesheet-utilization':
        return this.executeTimesheetUtilization(executeDto.params);
      default:
        // Generic query execution (be careful with security!)
        return this.executeGenericQuery(report.config, executeDto.params);
    }
  }

  private async executeRevenueByMonth(params?: any): Promise<any> {
    const startDate = params?.startDate || null;
    const endDate = params?.endDate || null;
    
    const query = `
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        SUM(total) as revenue,
        COUNT(*) as invoice_count
      FROM invoices
      WHERE status = 'paid'
      ${startDate ? `AND created_at >= $1` : ''}
      ${endDate ? `AND created_at <= $${startDate ? 2 : 1}` : ''}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `;

    const queryParams = [];
    if (startDate) queryParams.push(startDate);
    if (endDate) queryParams.push(endDate);

    return this.dataSource.query(query, queryParams);
  }

  private async executeTopCustomers(params?: any): Promise<any> {
    const limit = params?.limit || 10;
    
    const query = `
      SELECT 
        c.name as customer_name,
        c.id as customer_id,
        COUNT(i.id) as invoice_count,
        SUM(i.total) as total_revenue
      FROM contacts c
      LEFT JOIN invoices i ON i.contact_id = c.id
      WHERE c.is_customer = true AND i.status = 'paid'
      GROUP BY c.id, c.name
      ORDER BY total_revenue DESC
      LIMIT ${limit}
    `;

    return this.dataSource.query(query);
  }

  private async executeInventoryValuation(params?: any): Promise<any> {
    const query = `
      SELECT 
        p.name as product_name,
        p.sku,
        pv.quantity_on_hand,
        pv.cost_price,
        (pv.quantity_on_hand * pv.cost_price) as valuation
      FROM products p
      LEFT JOIN product_variants pv ON pv.product_id = p.id
      WHERE p.type = 'storable'
      ORDER BY valuation DESC
    `;

    return this.dataSource.query(query);
  }

  private async executeTimesheetUtilization(params?: any): Promise<any> {
    const startDate = params?.startDate || null;
    const endDate = params?.endDate || null;
    
    const query = `
      SELECT 
        u.name as employee_name,
        u.id as employee_id,
        SUM(t.hours_spent) as total_hours,
        COUNT(DISTINCT DATE(t.date)) as days_worked,
        AVG(t.hours_spent) as avg_hours_per_day
      FROM timesheets t
      JOIN users u ON u.id = t.user_id
      ${startDate ? `WHERE t.date >= $1` : ''}
      ${endDate ? `${startDate ? 'AND' : 'WHERE'} t.date <= $${startDate ? 2 : 1}` : ''}
      GROUP BY u.id, u.name
      ORDER BY total_hours DESC
    `;

    const queryParams = [];
    if (startDate) queryParams.push(startDate);
    if (endDate) queryParams.push(endDate);

    return this.dataSource.query(query, queryParams);
  }

  private async executeGenericQuery(config: any, params?: any): Promise<any> {
    // This should be implemented with proper security and query validation
    // For now, return a stub response
    return {
      message: 'Generic query execution not implemented',
      config,
      params,
    };
  }
}

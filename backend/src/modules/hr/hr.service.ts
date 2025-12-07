import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { 
  Employee, 
  AttendanceLog, 
  LeaveRequest, 
  ExpenseClaim, 
  PayrollConfig,
  Payslip,
  LeaveStatus,
  ExpenseStatus,
  PayslipStatus
} from '../../database/entities';
import { 
  CreateEmployeeDto, 
  UpdateEmployeeDto,
  ClockInDto,
  ClockOutDto,
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
  CreateExpenseClaimDto,
  UpdateExpenseClaimDto,
  CreatePayrollConfigDto,
  UpdatePayrollConfigDto,
  GeneratePayrollDto
} from './dto';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @InjectRepository(AttendanceLog)
    private attendanceRepository: Repository<AttendanceLog>,
    @InjectRepository(LeaveRequest)
    private leaveRequestsRepository: Repository<LeaveRequest>,
    @InjectRepository(ExpenseClaim)
    private expenseClaimsRepository: Repository<ExpenseClaim>,
    @InjectRepository(PayrollConfig)
    private payrollConfigsRepository: Repository<PayrollConfig>,
    @InjectRepository(Payslip)
    private payslipsRepository: Repository<Payslip>,
  ) {}

  // ===========================
  // EMPLOYEE METHODS
  // ===========================

  async createEmployee(tenantId: string, dto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.employeesRepository.findOne({
      where: { employeeCode: dto.employeeCode, deletedAt: IsNull() },
    });

    if (existing) {
      throw new BadRequestException('Employee code already exists');
    }

    const employee = this.employeesRepository.create({
      ...dto,
      tenantId,
    });

    return this.employeesRepository.save(employee);
  }

  async findAllEmployees(tenantId: string): Promise<Employee[]> {
    return this.employeesRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['user'],
      order: { employeeCode: 'ASC' },
    });
  }

  async findOneEmployee(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['user', 'attendanceLogs', 'leaveRequests'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOneEmployee(id);
    Object.assign(employee, dto);
    return this.employeesRepository.save(employee);
  }

  async removeEmployee(id: string): Promise<void> {
    const employee = await this.findOneEmployee(id);
    employee.deletedAt = new Date();
    await this.employeesRepository.save(employee);
  }

  // ===========================
  // ATTENDANCE METHODS
  // ===========================

  async clockIn(employeeId: string, tenantId: string, dto: ClockInDto): Promise<AttendanceLog> {
    const employee = await this.findOneEmployee(employeeId);

    // Check if already clocked in
    const existing = await this.attendanceRepository.findOne({
      where: { 
        employeeId, 
        clockOut: IsNull(), 
        deletedAt: IsNull() 
      },
    });

    if (existing) {
      throw new BadRequestException('Already clocked in. Clock out first.');
    }

    const attendance = this.attendanceRepository.create({
      tenantId,
      employeeId,
      clockIn: new Date(),
      source: dto.source,
      notes: dto.notes,
    });

    return this.attendanceRepository.save(attendance);
  }

  async clockOut(employeeId: string, dto: ClockOutDto): Promise<AttendanceLog> {
    const attendance = await this.attendanceRepository.findOne({
      where: { 
        employeeId, 
        clockOut: IsNull(), 
        deletedAt: IsNull() 
      },
    });

    if (!attendance) {
      throw new NotFoundException('No active clock-in found');
    }

    attendance.clockOut = new Date();
    if (dto.notes) {
      attendance.notes = dto.notes;
    }

    return this.attendanceRepository.save(attendance);
  }

  async getAttendanceLogs(employeeId: string, startDate?: Date, endDate?: Date): Promise<AttendanceLog[]> {
    const where: any = { employeeId, deletedAt: IsNull() };

    // Add date filters if provided
    // Note: In production, use proper date range query

    return this.attendanceRepository.find({
      where,
      order: { clockIn: 'DESC' },
    });
  }

  // ===========================
  // LEAVE REQUEST METHODS
  // ===========================

  async createLeaveRequest(employeeId: string, tenantId: string, dto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const employee = await this.findOneEmployee(employeeId);

    const leaveRequest = this.leaveRequestsRepository.create({
      ...dto,
      tenantId,
      employeeId,
      status: LeaveStatus.PENDING,
    });

    return this.leaveRequestsRepository.save(leaveRequest);
  }

  async findAllLeaveRequests(tenantId: string, status?: LeaveStatus): Promise<LeaveRequest[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (status) {
      where.status = status;
    }

    return this.leaveRequestsRepository.find({
      where,
      relations: ['employee', 'employee.user', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneLeaveRequest(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['employee', 'employee.user', 'approver'],
    });

    if (!leaveRequest) {
      throw new NotFoundException('Leave request not found');
    }

    return leaveRequest;
  }

  async updateLeaveRequest(id: string, dto: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOneLeaveRequest(id);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Can only update pending leave requests');
    }

    Object.assign(leaveRequest, dto);
    return this.leaveRequestsRepository.save(leaveRequest);
  }

  async approveLeaveRequest(id: string, approverId: string, dto: ApproveLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOneLeaveRequest(id);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is not pending');
    }

    leaveRequest.status = LeaveStatus.APPROVED;
    leaveRequest.approverId = approverId;
    leaveRequest.approvedAt = new Date();
    leaveRequest.approverNotes = dto.approverNotes;

    return this.leaveRequestsRepository.save(leaveRequest);
  }

  async rejectLeaveRequest(id: string, approverId: string, dto: RejectLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOneLeaveRequest(id);

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave request is not pending');
    }

    leaveRequest.status = LeaveStatus.REJECTED;
    leaveRequest.approverId = approverId;
    leaveRequest.approvedAt = new Date();
    leaveRequest.approverNotes = dto.approverNotes;

    return this.leaveRequestsRepository.save(leaveRequest);
  }

  // ===========================
  // EXPENSE CLAIM METHODS
  // ===========================

  async createExpenseClaim(employeeId: string, tenantId: string, dto: CreateExpenseClaimDto): Promise<ExpenseClaim> {
    const employee = await this.findOneEmployee(employeeId);

    const expenseClaim = this.expenseClaimsRepository.create({
      ...dto,
      tenantId,
      employeeId,
      status: ExpenseStatus.DRAFT,
    });

    return this.expenseClaimsRepository.save(expenseClaim);
  }

  async findAllExpenseClaims(tenantId: string, status?: ExpenseStatus): Promise<ExpenseClaim[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (status) {
      where.status = status;
    }

    return this.expenseClaimsRepository.find({
      where,
      relations: ['employee', 'employee.user', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneExpenseClaim(id: string): Promise<ExpenseClaim> {
    const expenseClaim = await this.expenseClaimsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['employee', 'employee.user', 'approver'],
    });

    if (!expenseClaim) {
      throw new NotFoundException('Expense claim not found');
    }

    return expenseClaim;
  }

  async updateExpenseClaim(id: string, dto: UpdateExpenseClaimDto): Promise<ExpenseClaim> {
    const expenseClaim = await this.findOneExpenseClaim(id);

    if (expenseClaim.status !== ExpenseStatus.DRAFT) {
      throw new BadRequestException('Can only update draft expense claims');
    }

    Object.assign(expenseClaim, dto);
    return this.expenseClaimsRepository.save(expenseClaim);
  }

  async submitExpenseClaim(id: string): Promise<ExpenseClaim> {
    const expenseClaim = await this.findOneExpenseClaim(id);

    if (expenseClaim.status !== ExpenseStatus.DRAFT) {
      throw new BadRequestException('Can only submit draft expense claims');
    }

    expenseClaim.status = ExpenseStatus.SUBMITTED;
    return this.expenseClaimsRepository.save(expenseClaim);
  }

  async approveExpenseClaim(id: string, approverId: string): Promise<ExpenseClaim> {
    const expenseClaim = await this.findOneExpenseClaim(id);

    if (expenseClaim.status !== ExpenseStatus.SUBMITTED) {
      throw new BadRequestException('Can only approve submitted expense claims');
    }

    expenseClaim.status = ExpenseStatus.APPROVED;
    expenseClaim.approvedBy = approverId;
    expenseClaim.approvedAt = new Date();

    return this.expenseClaimsRepository.save(expenseClaim);
  }

  async rejectExpenseClaim(id: string, approverId: string): Promise<ExpenseClaim> {
    const expenseClaim = await this.findOneExpenseClaim(id);

    if (expenseClaim.status !== ExpenseStatus.SUBMITTED) {
      throw new BadRequestException('Can only reject submitted expense claims');
    }

    expenseClaim.status = ExpenseStatus.REJECTED;
    expenseClaim.approvedBy = approverId;
    expenseClaim.approvedAt = new Date();

    return this.expenseClaimsRepository.save(expenseClaim);
  }

  async markExpenseAsPaid(id: string): Promise<ExpenseClaim> {
    const expenseClaim = await this.findOneExpenseClaim(id);

    if (expenseClaim.status !== ExpenseStatus.APPROVED) {
      throw new BadRequestException('Can only mark approved expenses as paid');
    }

    expenseClaim.status = ExpenseStatus.PAID;
    expenseClaim.paidAt = new Date();

    return this.expenseClaimsRepository.save(expenseClaim);
  }

  // ===========================
  // PAYROLL CONFIG METHODS
  // ===========================

  async createPayrollConfig(tenantId: string, dto: CreatePayrollConfigDto): Promise<PayrollConfig> {
    const employee = await this.findOneEmployee(dto.employeeId);

    const config = this.payrollConfigsRepository.create({
      ...dto,
      tenantId,
    });

    return this.payrollConfigsRepository.save(config);
  }

  async findAllPayrollConfigs(tenantId: string, employeeId?: string): Promise<PayrollConfig[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (employeeId) {
      where.employeeId = employeeId;
    }

    return this.payrollConfigsRepository.find({
      where,
      relations: ['employee', 'employee.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOnePayrollConfig(id: string): Promise<PayrollConfig> {
    const config = await this.payrollConfigsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['employee', 'employee.user'],
    });

    if (!config) {
      throw new NotFoundException('Payroll config not found');
    }

    return config;
  }

  async updatePayrollConfig(id: string, dto: UpdatePayrollConfigDto): Promise<PayrollConfig> {
    const config = await this.findOnePayrollConfig(id);
    Object.assign(config, dto);
    return this.payrollConfigsRepository.save(config);
  }

  // ===========================
  // PAYSLIP METHODS
  // ===========================

  async generatePayroll(tenantId: string, dto: GeneratePayrollDto, userId: string): Promise<Payslip[]> {
    // Parse period (YYYY-MM)
    const [year, month] = dto.period.split('-').map(Number);
    const periodStart = new Date(year, month - 1, 1);
    const periodEnd = new Date(year, month, 0);

    // Get all active employees
    const employees = await this.employeesRepository.find({
      where: { tenantId, deletedAt: IsNull() },
      relations: ['user'],
    });

    const payslips: Payslip[] = [];

    for (const employee of employees) {
      // Get active payroll config
      const config = await this.payrollConfigsRepository.findOne({
        where: { 
          employeeId: employee.id, 
          isActive: true,
          deletedAt: IsNull() 
        },
      });

      if (!config) {
        continue; // Skip employees without payroll config
      }

      // Calculate gross and net
      let gross = config.baseSalary;
      let totalAllowances = 0;
      let totalDeductions = 0;

      const allowancesBreakdown = (config.allowances || []).map(allowance => {
        const amount = allowance.type === 'percentage' 
          ? (config.baseSalary * allowance.amount / 100)
          : allowance.amount;
        totalAllowances += amount;
        return { name: allowance.name, amount };
      });

      const deductionsBreakdown = (config.deductions || []).map(deduction => {
        const amount = deduction.type === 'percentage'
          ? ((config.baseSalary + totalAllowances) * deduction.amount / 100)
          : deduction.amount;
        totalDeductions += amount;
        return { name: deduction.name, amount };
      });

      gross = config.baseSalary + totalAllowances;
      const net = gross - totalDeductions;

      const payslip = this.payslipsRepository.create({
        tenantId,
        employeeId: employee.id,
        periodStart,
        periodEnd,
        gross,
        net,
        breakdown: {
          baseSalary: config.baseSalary,
          allowances: allowancesBreakdown,
          deductions: deductionsBreakdown,
          taxes: [], // Simplified - no tax calculation in this version
        },
        status: PayslipStatus.DRAFT,
        currency: config.currency,
        processedBy: userId,
        processedAt: new Date(),
      });

      payslips.push(await this.payslipsRepository.save(payslip));
    }

    return payslips;
  }

  async findAllPayslips(tenantId: string, employeeId?: string): Promise<Payslip[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (employeeId) {
      where.employeeId = employeeId;
    }

    return this.payslipsRepository.find({
      where,
      relations: ['employee', 'employee.user', 'processor'],
      order: { periodStart: 'DESC' },
    });
  }

  async findOnePayslip(id: string): Promise<Payslip> {
    const payslip = await this.payslipsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['employee', 'employee.user', 'processor'],
    });

    if (!payslip) {
      throw new NotFoundException('Payslip not found');
    }

    return payslip;
  }

  async markPayslipAsPaid(id: string): Promise<Payslip> {
    const payslip = await this.findOnePayslip(id);

    if (payslip.status === PayslipStatus.PAID) {
      throw new BadRequestException('Payslip already marked as paid');
    }

    payslip.status = PayslipStatus.PAID;
    payslip.paidAt = new Date();

    return this.payslipsRepository.save(payslip);
  }
}

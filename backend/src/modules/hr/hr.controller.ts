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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
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
  GeneratePayrollDto,
} from './dto';
import { LeaveStatus, ExpenseStatus } from '../../database/entities';

@ApiTags('HR & Payroll')
@ApiBearerAuth()
@Controller('hr')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  // ===========================
  // EMPLOYEE ENDPOINTS
  // ===========================

  @Post('employees')
  @ApiOperation({ summary: 'Create employee' })
  @RequirePermissions('hr:employee:create')
  async createEmployee(@Request() req: any, @Body() dto: CreateEmployeeDto) {
    return this.hrService.createEmployee(req.user.tenantId, dto);
  }

  @Get('employees')
  @ApiOperation({ summary: 'Get all employees' })
  @RequirePermissions('hr:employee:read')
  async findAllEmployees(@Request() req: any) {
    return this.hrService.findAllEmployees(req.user.tenantId);
  }

  @Get('employees/:id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @RequirePermissions('hr:employee:read')
  async findOneEmployee(@Param('id') id: string) {
    return this.hrService.findOneEmployee(id);
  }

  @Put('employees/:id')
  @ApiOperation({ summary: 'Update employee' })
  @RequirePermissions('hr:employee:update')
  async updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.hrService.updateEmployee(id, dto);
  }

  @Delete('employees/:id')
  @ApiOperation({ summary: 'Delete employee' })
  @RequirePermissions('hr:employee:delete')
  async removeEmployee(@Param('id') id: string) {
    await this.hrService.removeEmployee(id);
    return { message: 'Employee deleted successfully' };
  }

  // ===========================
  // ATTENDANCE ENDPOINTS
  // ===========================

  @Post('attendance/clock-in')
  @ApiOperation({ summary: 'Clock in' })
  @RequirePermissions('hr:attendance:create')
  async clockIn(@Request() req: any, @Body() dto: ClockInDto) {
    // In a real app, get employeeId from the logged-in user
    // For now, assuming the request has employeeId
    const employeeId = req.body.employeeId || req.user.employeeId;
    return this.hrService.clockIn(employeeId, req.user.tenantId, dto);
  }

  @Post('attendance/clock-out')
  @ApiOperation({ summary: 'Clock out' })
  @RequirePermissions('hr:attendance:create')
  async clockOut(@Request() req: any, @Body() dto: ClockOutDto) {
    const employeeId = req.body.employeeId || req.user.employeeId;
    return this.hrService.clockOut(employeeId, dto);
  }

  @Get('attendance/:employeeId')
  @ApiOperation({ summary: 'Get attendance logs for employee' })
  @RequirePermissions('hr:attendance:read')
  async getAttendanceLogs(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.hrService.getAttendanceLogs(employeeId, startDate, endDate);
  }

  // ===========================
  // LEAVE REQUEST ENDPOINTS
  // ===========================

  @Post('leave-requests')
  @ApiOperation({ summary: 'Create leave request' })
  @RequirePermissions('hr:leave:create')
  async createLeaveRequest(@Request() req: any, @Body() dto: CreateLeaveRequestDto) {
    const employeeId = req.body.employeeId || req.user.employeeId;
    return this.hrService.createLeaveRequest(employeeId, req.user.tenantId, dto);
  }

  @Get('leave-requests')
  @ApiOperation({ summary: 'Get all leave requests' })
  @RequirePermissions('hr:leave:read')
  async findAllLeaveRequests(
    @Request() req: any,
    @Query('status') status?: LeaveStatus,
  ) {
    return this.hrService.findAllLeaveRequests(req.user.tenantId, status);
  }

  @Get('leave-requests/:id')
  @ApiOperation({ summary: 'Get leave request by ID' })
  @RequirePermissions('hr:leave:read')
  async findOneLeaveRequest(@Param('id') id: string) {
    return this.hrService.findOneLeaveRequest(id);
  }

  @Put('leave-requests/:id')
  @ApiOperation({ summary: 'Update leave request' })
  @RequirePermissions('hr:leave:update')
  async updateLeaveRequest(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveRequestDto,
  ) {
    return this.hrService.updateLeaveRequest(id, dto);
  }

  @Post('leave-requests/:id/approve')
  @ApiOperation({ summary: 'Approve leave request' })
  @RequirePermissions('hr:leave:approve')
  async approveLeaveRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: ApproveLeaveRequestDto,
  ) {
    return this.hrService.approveLeaveRequest(id, req.user.id, dto);
  }

  @Post('leave-requests/:id/reject')
  @ApiOperation({ summary: 'Reject leave request' })
  @RequirePermissions('hr:leave:approve')
  async rejectLeaveRequest(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: RejectLeaveRequestDto,
  ) {
    return this.hrService.rejectLeaveRequest(id, req.user.id, dto);
  }

  // ===========================
  // EXPENSE CLAIM ENDPOINTS
  // ===========================

  @Post('expense-claims')
  @ApiOperation({ summary: 'Create expense claim' })
  @RequirePermissions('hr:expense:create')
  async createExpenseClaim(@Request() req: any, @Body() dto: CreateExpenseClaimDto) {
    const employeeId = req.body.employeeId || req.user.employeeId;
    return this.hrService.createExpenseClaim(employeeId, req.user.tenantId, dto);
  }

  @Get('expense-claims')
  @ApiOperation({ summary: 'Get all expense claims' })
  @RequirePermissions('hr:expense:read')
  async findAllExpenseClaims(
    @Request() req: any,
    @Query('status') status?: ExpenseStatus,
  ) {
    return this.hrService.findAllExpenseClaims(req.user.tenantId, status);
  }

  @Get('expense-claims/:id')
  @ApiOperation({ summary: 'Get expense claim by ID' })
  @RequirePermissions('hr:expense:read')
  async findOneExpenseClaim(@Param('id') id: string) {
    return this.hrService.findOneExpenseClaim(id);
  }

  @Put('expense-claims/:id')
  @ApiOperation({ summary: 'Update expense claim' })
  @RequirePermissions('hr:expense:update')
  async updateExpenseClaim(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseClaimDto,
  ) {
    return this.hrService.updateExpenseClaim(id, dto);
  }

  @Post('expense-claims/:id/submit')
  @ApiOperation({ summary: 'Submit expense claim' })
  @RequirePermissions('hr:expense:update')
  async submitExpenseClaim(@Param('id') id: string) {
    return this.hrService.submitExpenseClaim(id);
  }

  @Post('expense-claims/:id/approve')
  @ApiOperation({ summary: 'Approve expense claim' })
  @RequirePermissions('hr:expense:approve')
  async approveExpenseClaim(@Request() req: any, @Param('id') id: string) {
    return this.hrService.approveExpenseClaim(id, req.user.id);
  }

  @Post('expense-claims/:id/reject')
  @ApiOperation({ summary: 'Reject expense claim' })
  @RequirePermissions('hr:expense:approve')
  async rejectExpenseClaim(@Request() req: any, @Param('id') id: string) {
    return this.hrService.rejectExpenseClaim(id, req.user.id);
  }

  @Post('expense-claims/:id/mark-paid')
  @ApiOperation({ summary: 'Mark expense as paid' })
  @RequirePermissions('hr:expense:update')
  async markExpenseAsPaid(@Param('id') id: string) {
    return this.hrService.markExpenseAsPaid(id);
  }

  // ===========================
  // PAYROLL CONFIG ENDPOINTS
  // ===========================

  @Post('payroll-configs')
  @ApiOperation({ summary: 'Create payroll config' })
  @RequirePermissions('hr:payroll:create')
  async createPayrollConfig(@Request() req: any, @Body() dto: CreatePayrollConfigDto) {
    return this.hrService.createPayrollConfig(req.user.tenantId, dto);
  }

  @Get('payroll-configs')
  @ApiOperation({ summary: 'Get all payroll configs' })
  @RequirePermissions('hr:payroll:read')
  async findAllPayrollConfigs(
    @Request() req: any,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.hrService.findAllPayrollConfigs(req.user.tenantId, employeeId);
  }

  @Get('payroll-configs/:id')
  @ApiOperation({ summary: 'Get payroll config by ID' })
  @RequirePermissions('hr:payroll:read')
  async findOnePayrollConfig(@Param('id') id: string) {
    return this.hrService.findOnePayrollConfig(id);
  }

  @Put('payroll-configs/:id')
  @ApiOperation({ summary: 'Update payroll config' })
  @RequirePermissions('hr:payroll:update')
  async updatePayrollConfig(
    @Param('id') id: string,
    @Body() dto: UpdatePayrollConfigDto,
  ) {
    return this.hrService.updatePayrollConfig(id, dto);
  }

  // ===========================
  // PAYSLIP ENDPOINTS
  // ===========================

  @Post('payroll/run')
  @ApiOperation({ summary: 'Generate payslips for period' })
  @RequirePermissions('hr:payroll:create')
  async generatePayroll(@Request() req: any, @Body() dto: GeneratePayrollDto) {
    return this.hrService.generatePayroll(req.user.tenantId, dto, req.user.id);
  }

  @Get('payslips')
  @ApiOperation({ summary: 'Get all payslips' })
  @RequirePermissions('hr:payroll:read')
  async findAllPayslips(
    @Request() req: any,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.hrService.findAllPayslips(req.user.tenantId, employeeId);
  }

  @Get('payslips/:id')
  @ApiOperation({ summary: 'Get payslip by ID' })
  @RequirePermissions('hr:payroll:read')
  async findOnePayslip(@Param('id') id: string) {
    return this.hrService.findOnePayslip(id);
  }

  @Post('payslips/:id/mark-paid')
  @ApiOperation({ summary: 'Mark payslip as paid' })
  @RequirePermissions('hr:payroll:update')
  async markPayslipAsPaid(@Param('id') id: string) {
    return this.hrService.markPayslipAsPaid(id);
  }
}

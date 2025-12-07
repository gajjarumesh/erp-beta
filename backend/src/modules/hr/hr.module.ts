import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import {
  Employee,
  AttendanceLog,
  LeaveRequest,
  ExpenseClaim,
  PayrollConfig,
  Payslip,
} from '../../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      AttendanceLog,
      LeaveRequest,
      ExpenseClaim,
      PayrollConfig,
      Payslip,
    ]),
  ],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}

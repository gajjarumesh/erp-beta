import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedReport, DashboardWidget } from '../../database/entities';
import { ReportsController } from './reports.controller';
import { SavedReportsService } from './saved-reports.service';
import { DashboardWidgetsService } from './dashboard-widgets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedReport, DashboardWidget]),
  ],
  controllers: [ReportsController],
  providers: [SavedReportsService, DashboardWidgetsService],
  exports: [SavedReportsService, DashboardWidgetsService],
})
export class ReportsModule {}

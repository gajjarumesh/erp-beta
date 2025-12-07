import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SavedReportsService } from './saved-reports.service';
import { DashboardWidgetsService } from './dashboard-widgets.service';
import {
  CreateSavedReportDto,
  UpdateSavedReportDto,
  ExecuteReportDto,
} from './dto/saved-report.dto';
import {
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
} from './dto/dashboard-widget.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Reports & BI')
@Controller('reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(
    private readonly savedReportsService: SavedReportsService,
    private readonly dashboardWidgetsService: DashboardWidgetsService,
  ) {}

  // Saved Reports
  @Post()
  @RequirePermissions('reports:create')
  @ApiOperation({ summary: 'Create a saved report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  async createReport(@Body() createDto: CreateSavedReportDto, @Request() req: any) {
    return this.savedReportsService.create(createDto, req.user.id);
  }

  @Get()
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get all saved reports' })
  @ApiResponse({ status: 200, description: 'List of saved reports' })
  async findAllReports(
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.savedReportsService.findAll(category, isActive);
  }

  @Get(':slug')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get a saved report by slug' })
  @ApiResponse({ status: 200, description: 'Saved report details' })
  async findOneReport(@Param('slug') slug: string) {
    return this.savedReportsService.findOne(slug);
  }

  @Put(':slug')
  @RequirePermissions('reports:update')
  @ApiOperation({ summary: 'Update a saved report' })
  @ApiResponse({ status: 200, description: 'Report updated successfully' })
  async updateReport(
    @Param('slug') slug: string,
    @Body() updateDto: UpdateSavedReportDto,
  ) {
    return this.savedReportsService.update(slug, updateDto);
  }

  @Delete(':slug')
  @RequirePermissions('reports:delete')
  @ApiOperation({ summary: 'Delete a saved report' })
  @ApiResponse({ status: 200, description: 'Report deleted successfully' })
  async removeReport(@Param('slug') slug: string) {
    return this.savedReportsService.remove(slug);
  }

  @Post(':slug/execute')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Execute a saved report' })
  @ApiResponse({ status: 200, description: 'Report execution results' })
  async executeReport(
    @Param('slug') slug: string,
    @Body() executeDto: ExecuteReportDto,
  ) {
    return this.savedReportsService.execute(slug, executeDto);
  }

  // Dashboard Widgets
  @Post('widgets')
  @RequirePermissions('reports:create')
  @ApiOperation({ summary: 'Create a dashboard widget' })
  @ApiResponse({ status: 201, description: 'Widget created successfully' })
  async createWidget(@Body() createDto: CreateDashboardWidgetDto, @Request() req: any) {
    return this.dashboardWidgetsService.create(createDto, req.user.id);
  }

  @Get('widgets')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get all dashboard widgets for current user' })
  @ApiResponse({ status: 200, description: 'List of dashboard widgets' })
  async findAllWidgets(@Request() req: any, @Query('isActive') isActive?: boolean) {
    return this.dashboardWidgetsService.findAll(req.user.id, isActive);
  }

  @Get('widgets/:id')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get a dashboard widget by ID' })
  @ApiResponse({ status: 200, description: 'Dashboard widget details' })
  async findOneWidget(@Param('id') id: string, @Request() req: any) {
    return this.dashboardWidgetsService.findOne(id, req.user.id);
  }

  @Put('widgets/:id')
  @RequirePermissions('reports:update')
  @ApiOperation({ summary: 'Update a dashboard widget' })
  @ApiResponse({ status: 200, description: 'Widget updated successfully' })
  async updateWidget(
    @Param('id') id: string,
    @Body() updateDto: UpdateDashboardWidgetDto,
    @Request() req: any,
  ) {
    return this.dashboardWidgetsService.update(id, updateDto, req.user.id);
  }

  @Delete('widgets/:id')
  @RequirePermissions('reports:delete')
  @ApiOperation({ summary: 'Delete a dashboard widget' })
  @ApiResponse({ status: 200, description: 'Widget deleted successfully' })
  async removeWidget(@Param('id') id: string, @Request() req: any) {
    return this.dashboardWidgetsService.remove(id, req.user.id);
  }

  @Put('widgets/positions')
  @RequirePermissions('reports:update')
  @ApiOperation({ summary: 'Update widget positions' })
  @ApiResponse({ status: 200, description: 'Positions updated successfully' })
  async updateWidgetPositions(
    @Body() positions: { id: string; position: any }[],
    @Request() req: any,
  ) {
    return this.dashboardWidgetsService.updatePositions(positions, req.user.id);
  }
}

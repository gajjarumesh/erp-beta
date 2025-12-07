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
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateTaskCommentDto,
  CreateTimesheetDto,
  UpdateTimesheetDto,
} from './dto';
import { ProjectStatus, TaskStatus } from '../../database/entities';

@ApiTags('Projects & Tasks')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ===========================
  // PROJECT ENDPOINTS
  // ===========================

  @Post()
  @ApiOperation({ summary: 'Create project' })
  @RequirePermissions('projects:project:create')
  async createProject(@Request() req: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(req.user.tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @RequirePermissions('projects:project:read')
  async findAllProjects(
    @Request() req: any,
    @Query('status') status?: ProjectStatus,
  ) {
    return this.projectsService.findAllProjects(req.user.tenantId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @RequirePermissions('projects:project:read')
  async findOneProject(@Param('id') id: string) {
    return this.projectsService.findOneProject(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @RequirePermissions('projects:project:update')
  async updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @RequirePermissions('projects:project:delete')
  async removeProject(@Param('id') id: string) {
    await this.projectsService.removeProject(id);
    return { message: 'Project deleted successfully' };
  }

  // ===========================
  // TASK ENDPOINTS
  // ===========================

  @Post('tasks')
  @ApiOperation({ summary: 'Create task' })
  @RequirePermissions('projects:task:create')
  async createTask(@Request() req: any, @Body() dto: CreateTaskDto) {
    return this.projectsService.createTask(req.user.tenantId, dto);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all tasks' })
  @RequirePermissions('projects:task:read')
  async findAllTasks(
    @Request() req: any,
    @Query('projectId') projectId?: string,
    @Query('status') status?: TaskStatus,
  ) {
    return this.projectsService.findAllTasks(req.user.tenantId, projectId, status);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get task by ID' })
  @RequirePermissions('projects:task:read')
  async findOneTask(@Param('id') id: string) {
    return this.projectsService.findOneTask(id);
  }

  @Put('tasks/:id')
  @ApiOperation({ summary: 'Update task (including status/priority for kanban)' })
  @RequirePermissions('projects:task:update')
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.projectsService.updateTask(id, dto);
  }

  @Delete('tasks/:id')
  @ApiOperation({ summary: 'Delete task' })
  @RequirePermissions('projects:task:delete')
  async removeTask(@Param('id') id: string) {
    await this.projectsService.removeTask(id);
    return { message: 'Task deleted successfully' };
  }

  // ===========================
  // TASK COMMENT ENDPOINTS
  // ===========================

  @Post('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Add comment to task' })
  @RequirePermissions('projects:task:update')
  async createTaskComment(
    @Request() req: any,
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskCommentDto,
  ) {
    return this.projectsService.createTaskComment(
      taskId,
      req.user.id,
      req.user.tenantId,
      dto,
    );
  }

  @Get('tasks/:taskId/comments')
  @ApiOperation({ summary: 'Get task comments' })
  @RequirePermissions('projects:task:read')
  async findTaskComments(@Param('taskId') taskId: string) {
    return this.projectsService.findTaskComments(taskId);
  }

  // ===========================
  // TIMESHEET ENDPOINTS
  // ===========================

  @Post('timesheets')
  @ApiOperation({ summary: 'Create timesheet entry' })
  @RequirePermissions('projects:timesheet:create')
  async createTimesheet(@Request() req: any, @Body() dto: CreateTimesheetDto) {
    return this.projectsService.createTimesheet(req.user.tenantId, dto);
  }

  @Get('timesheets')
  @ApiOperation({ summary: 'Get all timesheets' })
  @RequirePermissions('projects:timesheet:read')
  async findAllTimesheets(
    @Request() req: any,
    @Query('employeeId') employeeId?: string,
    @Query('projectId') projectId?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.projectsService.findAllTimesheets(
      req.user.tenantId,
      employeeId,
      projectId,
      startDate,
      endDate,
    );
  }

  @Get('timesheets/:id')
  @ApiOperation({ summary: 'Get timesheet by ID' })
  @RequirePermissions('projects:timesheet:read')
  async findOneTimesheet(@Param('id') id: string) {
    return this.projectsService.findOneTimesheet(id);
  }

  @Put('timesheets/:id')
  @ApiOperation({ summary: 'Update timesheet' })
  @RequirePermissions('projects:timesheet:update')
  async updateTimesheet(@Param('id') id: string, @Body() dto: UpdateTimesheetDto) {
    return this.projectsService.updateTimesheet(id, dto);
  }

  @Delete('timesheets/:id')
  @ApiOperation({ summary: 'Delete timesheet' })
  @RequirePermissions('projects:timesheet:delete')
  async removeTimesheet(@Param('id') id: string) {
    await this.projectsService.removeTimesheet(id);
    return { message: 'Timesheet deleted successfully' };
  }
}

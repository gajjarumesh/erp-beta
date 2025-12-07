import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { 
  Project, 
  Task, 
  TaskComment, 
  Timesheet,
  ProjectStatus,
  TaskStatus 
} from '../../database/entities';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateTaskDto,
  UpdateTaskDto,
  CreateTaskCommentDto,
  CreateTimesheetDto,
  UpdateTimesheetDto,
} from './dto';

@Injectable()
export class ProjectsService {
  private readonly MAX_HOURS_PER_DAY = 24; // Can be moved to settings service in production

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskComment)
    private taskCommentsRepository: Repository<TaskComment>,
    @InjectRepository(Timesheet)
    private timesheetsRepository: Repository<Timesheet>,
  ) {}

  // ===========================
  // PROJECT METHODS
  // ===========================

  async createProject(tenantId: string, dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      ...dto,
      tenantId,
    });

    return this.projectsRepository.save(project);
  }

  async findAllProjects(tenantId: string, status?: ProjectStatus): Promise<Project[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (status) {
      where.status = status;
    }

    return this.projectsRepository.find({
      where,
      relations: ['clientCompany', 'tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneProject(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['clientCompany', 'tasks', 'tasks.assignee', 'timesheets'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOneProject(id);
    Object.assign(project, dto);
    return this.projectsRepository.save(project);
  }

  async removeProject(id: string): Promise<void> {
    const project = await this.findOneProject(id);
    project.deletedAt = new Date();
    await this.projectsRepository.save(project);
  }

  // ===========================
  // TASK METHODS
  // ===========================

  async createTask(tenantId: string, dto: CreateTaskDto): Promise<Task> {
    // Verify project exists
    const project = await this.findOneProject(dto.projectId);

    const task = this.tasksRepository.create({
      ...dto,
      tenantId,
    });

    return this.tasksRepository.save(task);
  }

  async findAllTasks(tenantId: string, projectId?: string, status?: TaskStatus): Promise<Task[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (projectId) {
      where.projectId = projectId;
    }
    
    if (status) {
      where.status = status;
    }

    return this.tasksRepository.find({
      where,
      relations: ['project', 'assignee', 'comments'],
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOneTask(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['project', 'assignee', 'comments', 'comments.author', 'timesheets'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOneTask(id);
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async removeTask(id: string): Promise<void> {
    const task = await this.findOneTask(id);
    task.deletedAt = new Date();
    await this.tasksRepository.save(task);
  }

  // ===========================
  // TASK COMMENT METHODS
  // ===========================

  async createTaskComment(taskId: string, authorUserId: string, tenantId: string, dto: CreateTaskCommentDto): Promise<TaskComment> {
    const task = await this.findOneTask(taskId);

    const comment = this.taskCommentsRepository.create({
      ...dto,
      tenantId,
      taskId,
      authorUserId,
    });

    return this.taskCommentsRepository.save(comment);
  }

  async findTaskComments(taskId: string): Promise<TaskComment[]> {
    return this.taskCommentsRepository.find({
      where: { taskId, deletedAt: IsNull() },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  // ===========================
  // TIMESHEET METHODS
  // ===========================

  async createTimesheet(tenantId: string, dto: CreateTimesheetDto): Promise<Timesheet> {
    // Verify project and task exist
    const project = await this.findOneProject(dto.projectId);
    
    if (dto.taskId) {
      const task = await this.findOneTask(dto.taskId);
      if (task.projectId !== dto.projectId) {
        throw new BadRequestException('Task does not belong to the specified project');
      }
    }

    // Check max hours per day (from settings - simplified here)
    const maxHoursPerDay = this.MAX_HOURS_PER_DAY;
    
    // Check existing hours for the day
    const existingTimesheets = await this.timesheetsRepository.find({
      where: {
        employeeId: dto.employeeId,
        date: dto.date,
        deletedAt: IsNull(),
      },
    });

    const totalHours = existingTimesheets.reduce((sum, ts) => sum + Number(ts.hours), 0);
    
    if (totalHours + dto.hours > maxHoursPerDay) {
      throw new BadRequestException(`Total hours for the day would exceed ${maxHoursPerDay} hours`);
    }

    const timesheet = this.timesheetsRepository.create({
      ...dto,
      tenantId,
    });

    return this.timesheetsRepository.save(timesheet);
  }

  async findAllTimesheets(
    tenantId: string,
    employeeId?: string,
    projectId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Timesheet[]> {
    const where: any = { tenantId, deletedAt: IsNull() };
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (projectId) {
      where.projectId = projectId;
    }

    // In production, use proper date range query
    // For now, simplified

    return this.timesheetsRepository.find({
      where,
      relations: ['employee', 'employee.user', 'project', 'task'],
      order: { date: 'DESC' },
    });
  }

  async findOneTimesheet(id: string): Promise<Timesheet> {
    const timesheet = await this.timesheetsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['employee', 'employee.user', 'project', 'task'],
    });

    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }

    return timesheet;
  }

  async updateTimesheet(id: string, dto: UpdateTimesheetDto): Promise<Timesheet> {
    const timesheet = await this.findOneTimesheet(id);
    
    // If hours are being updated, validate max hours per day
    if (dto.hours !== undefined) {
      const maxHoursPerDay = this.MAX_HOURS_PER_DAY;
      
      // Get existing hours for the day, excluding the current timesheet
      const existingTimesheets = await this.timesheetsRepository.find({
        where: {
          employeeId: timesheet.employeeId,
          date: dto.date || timesheet.date,
          deletedAt: IsNull(),
        },
      });

      const totalHours = existingTimesheets
        .filter(ts => ts.id !== id)
        .reduce((sum, ts) => sum + Number(ts.hours), 0);
      
      if (totalHours + dto.hours > maxHoursPerDay) {
        throw new BadRequestException(`Total hours for the day would exceed ${maxHoursPerDay} hours`);
      }
    }
    
    Object.assign(timesheet, dto);
    return this.timesheetsRepository.save(timesheet);
  }

  async removeTimesheet(id: string): Promise<void> {
    const timesheet = await this.findOneTimesheet(id);
    timesheet.deletedAt = new Date();
    await this.timesheetsRepository.save(timesheet);
  }
}

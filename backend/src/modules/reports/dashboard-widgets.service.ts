import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardWidget } from '../../database/entities';
import { CreateDashboardWidgetDto, UpdateDashboardWidgetDto } from './dto/dashboard-widget.dto';

@Injectable()
export class DashboardWidgetsService {
  constructor(
    @InjectRepository(DashboardWidget)
    private readonly dashboardWidgetRepository: Repository<DashboardWidget>,
  ) {}

  async create(createDto: CreateDashboardWidgetDto, userId: string): Promise<DashboardWidget> {
    const widget = this.dashboardWidgetRepository.create({
      ...createDto,
      userId,
    });

    return this.dashboardWidgetRepository.save(widget);
  }

  async findAll(userId: string, isActive?: boolean): Promise<DashboardWidget[]> {
    const query = this.dashboardWidgetRepository.createQueryBuilder('widget')
      .where('widget.userId = :userId', { userId });

    if (isActive !== undefined) {
      query.andWhere('widget.isActive = :isActive', { isActive });
    }

    query.orderBy('widget.createdAt', 'ASC');

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<DashboardWidget> {
    const widget = await this.dashboardWidgetRepository.findOne({
      where: { id, userId },
    });

    if (!widget) {
      throw new NotFoundException(`Dashboard widget with ID ${id} not found`);
    }

    return widget;
  }

  async update(id: string, updateDto: UpdateDashboardWidgetDto, userId: string): Promise<DashboardWidget> {
    const widget = await this.findOne(id, userId);

    Object.assign(widget, updateDto);

    return this.dashboardWidgetRepository.save(widget);
  }

  async remove(id: string, userId: string): Promise<void> {
    const widget = await this.findOne(id, userId);
    await this.dashboardWidgetRepository.remove(widget);
  }

  async updatePositions(positions: { id: string; position: any }[], userId: string): Promise<void> {
    for (const { id, position } of positions) {
      await this.dashboardWidgetRepository.update(
        { id, userId },
        { position },
      );
    }
  }
}

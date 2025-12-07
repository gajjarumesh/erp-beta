import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pipeline, Stage } from '../../database/entities';
import { CreatePipelineDto, UpdatePipelineDto, CreateStageDto, UpdateStageDto } from './dto';

@Injectable()
export class PipelinesService {
  constructor(
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
  ) {}

  async createPipeline(tenantId: string, dto: CreatePipelineDto): Promise<Pipeline> {
    const pipeline = this.pipelineRepository.create({
      ...dto,
      tenantId,
    });

    return await this.pipelineRepository.save(pipeline);
  }

  async findAllPipelines(tenantId: string): Promise<Pipeline[]> {
    return await this.pipelineRepository.find({
      where: { tenantId },
      relations: ['stages'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOnePipeline(tenantId: string, id: string): Promise<Pipeline> {
    const pipeline = await this.pipelineRepository.findOne({
      where: { id, tenantId },
      relations: ['stages'],
    });

    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    return pipeline;
  }

  async updatePipeline(tenantId: string, id: string, dto: UpdatePipelineDto): Promise<Pipeline> {
    const pipeline = await this.findOnePipeline(tenantId, id);
    Object.assign(pipeline, dto);
    return await this.pipelineRepository.save(pipeline);
  }

  async removePipeline(tenantId: string, id: string): Promise<void> {
    const pipeline = await this.findOnePipeline(tenantId, id);
    await this.pipelineRepository.softRemove(pipeline);
  }

  async createStage(tenantId: string, dto: CreateStageDto): Promise<Stage> {
    const stage = this.stageRepository.create({
      ...dto,
      tenantId,
    });

    return await this.stageRepository.save(stage);
  }

  async findAllStages(tenantId: string, pipelineId?: string): Promise<Stage[]> {
    const where: any = { tenantId };
    if (pipelineId) {
      where.pipelineId = pipelineId;
    }

    return await this.stageRepository.find({
      where,
      order: { sortOrder: 'ASC' },
    });
  }

  async findOneStage(tenantId: string, id: string): Promise<Stage> {
    const stage = await this.stageRepository.findOne({
      where: { id, tenantId },
    });

    if (!stage) {
      throw new NotFoundException('Stage not found');
    }

    return stage;
  }

  async updateStage(tenantId: string, id: string, dto: UpdateStageDto): Promise<Stage> {
    const stage = await this.findOneStage(tenantId, id);
    Object.assign(stage, dto);
    return await this.stageRepository.save(stage);
  }

  async removeStage(tenantId: string, id: string): Promise<void> {
    const stage = await this.findOneStage(tenantId, id);
    await this.stageRepository.softRemove(stage);
  }
}

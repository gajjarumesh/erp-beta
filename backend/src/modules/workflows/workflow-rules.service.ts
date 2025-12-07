import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowRule, WorkflowLog, WorkflowLogStatus } from '../../database/entities';
import { CreateWorkflowRuleDto, UpdateWorkflowRuleDto, ExecuteWorkflowDto } from './dto/workflow-rule.dto';

@Injectable()
export class WorkflowRulesService {
  constructor(
    @InjectRepository(WorkflowRule)
    private readonly workflowRuleRepository: Repository<WorkflowRule>,
    @InjectRepository(WorkflowLog)
    private readonly workflowLogRepository: Repository<WorkflowLog>,
  ) {}

  async create(createDto: CreateWorkflowRuleDto, userId: string): Promise<WorkflowRule> {
    const workflow = this.workflowRuleRepository.create({
      ...createDto,
      createdBy: userId,
    });

    return this.workflowRuleRepository.save(workflow);
  }

  async findAll(tenantId: string, isActive?: boolean): Promise<WorkflowRule[]> {
    const query = this.workflowRuleRepository.createQueryBuilder('workflow')
      .where('workflow.tenantId = :tenantId', { tenantId });

    if (isActive !== undefined) {
      query.andWhere('workflow.isActive = :isActive', { isActive });
    }

    query.orderBy('workflow.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<WorkflowRule> {
    const workflow = await this.workflowRuleRepository.findOne({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow rule with ID ${id} not found`);
    }

    return workflow;
  }

  async update(id: string, updateDto: UpdateWorkflowRuleDto): Promise<WorkflowRule> {
    const workflow = await this.findOne(id);

    Object.assign(workflow, updateDto);

    return this.workflowRuleRepository.save(workflow);
  }

  async remove(id: string): Promise<void> {
    const workflow = await this.findOne(id);
    await this.workflowRuleRepository.remove(workflow);
  }

  async execute(id: string, executeDto: ExecuteWorkflowDto): Promise<any> {
    const workflow = await this.findOne(id);
    const startTime = Date.now();

    // Create log entry
    const log = this.workflowLogRepository.create({
      workflowId: id,
      status: WorkflowLogStatus.RUNNING,
      runAt: new Date(),
      inputSnapshot: executeDto.entityData,
    });

    try {
      // Evaluate conditions
      const conditionsMatch = this.evaluateConditions(
        workflow.conditions,
        executeDto.entityData,
      );

      if (!conditionsMatch) {
        log.status = WorkflowLogStatus.SUCCESS;
        log.outputSnapshot = { message: 'Conditions not met, workflow not executed' };
        log.executionTime = Date.now() - startTime;
        await this.workflowLogRepository.save(log);
        return { success: true, message: 'Conditions not met' };
      }

      // Execute actions
      const results = [];
      if (!executeDto.dryRun) {
        for (const action of workflow.actions) {
          const result = await this.executeAction(action, executeDto.entityData);
          results.push(result);
        }

        // Update workflow stats
        workflow.runsCount++;
        workflow.lastRunAt = new Date();
        await this.workflowRuleRepository.save(workflow);
      }

      log.status = WorkflowLogStatus.SUCCESS;
      log.outputSnapshot = { results, dryRun: executeDto.dryRun };
      log.executionTime = Date.now() - startTime;
      await this.workflowLogRepository.save(log);

      return {
        success: true,
        results,
        dryRun: executeDto.dryRun,
        executionTime: log.executionTime,
      };
    } catch (error) {
      log.status = WorkflowLogStatus.FAILED;
      log.errorMessage = error.message;
      log.executionTime = Date.now() - startTime;
      await this.workflowLogRepository.save(log);

      throw error;
    }
  }

  async getLogs(workflowId: string, limit = 50): Promise<WorkflowLog[]> {
    return this.workflowLogRepository.find({
      where: { workflowId },
      order: { runAt: 'DESC' },
      take: limit,
    });
  }

  private evaluateConditions(conditions: any, data: any): boolean {
    if (!conditions) return true;

    const { operator, conditions: conditionsList } = conditions;

    if (!conditionsList || conditionsList.length === 0) return true;

    const results = conditionsList.map((condition: any) => {
      return this.evaluateCondition(condition, data);
    });

    if (operator === 'OR') {
      return results.some((r: boolean) => r);
    }

    // Default to AND
    return results.every((r: boolean) => r);
  }

  private evaluateCondition(condition: any, data: any): boolean {
    const { field, operator, value } = condition;
    const fieldValue = this.getFieldValue(data, field);

    switch (operator) {
      case '==':
      case '=':
        return fieldValue == value;
      case '!=':
        return fieldValue != value;
      case '>':
        return fieldValue > value;
      case '<':
        return fieldValue < value;
      case '>=':
        return fieldValue >= value;
      case '<=':
        return fieldValue <= value;
      case 'contains':
        return String(fieldValue).includes(value);
      case 'startsWith':
        return String(fieldValue).startsWith(value);
      case 'endsWith':
        return String(fieldValue).endsWith(value);
      default:
        return false;
    }
  }

  private getFieldValue(data: any, field: string): any {
    const parts = field.split('.');
    let value = data;
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = value[part];
      } else {
        return undefined;
      }
    }
    return value;
  }

  private async executeAction(action: any, data: any): Promise<any> {
    const { type, config } = action;

    switch (type) {
      case 'send_email':
        return this.executeEmailAction(config, data);
      case 'send_sms':
        return this.executeSmsAction(config, data);
      case 'webhook':
        return this.executeWebhookAction(config, data);
      case 'update_record':
        return this.executeUpdateRecordAction(config, data);
      case 'create_record':
        return this.executeCreateRecordAction(config, data);
      default:
        return { success: false, message: `Unknown action type: ${type}` };
    }
  }

  private async executeEmailAction(config: any, data: any): Promise<any> {
    // Stub implementation - would integrate with notification service
    return {
      success: true,
      type: 'send_email',
      message: 'Email action would be executed',
      config,
    };
  }

  private async executeSmsAction(config: any, data: any): Promise<any> {
    // Stub implementation - would integrate with SMS service (e.g., Twilio)
    return {
      success: true,
      type: 'send_sms',
      message: 'SMS action would be executed',
      config,
    };
  }

  private async executeWebhookAction(config: any, data: any): Promise<any> {
    // Stub implementation - would make HTTP POST request
    return {
      success: true,
      type: 'webhook',
      message: 'Webhook would be called',
      config,
    };
  }

  private async executeUpdateRecordAction(config: any, data: any): Promise<any> {
    // Stub implementation - would update database record
    return {
      success: true,
      type: 'update_record',
      message: 'Record would be updated',
      config,
    };
  }

  private async executeCreateRecordAction(config: any, data: any): Promise<any> {
    // Stub implementation - would create database record
    return {
      success: true,
      type: 'create_record',
      message: 'Record would be created',
      config,
    };
  }
}

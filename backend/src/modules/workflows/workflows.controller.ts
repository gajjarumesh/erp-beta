import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowRulesService } from './workflow-rules.service';
import {
  CreateWorkflowRuleDto,
  UpdateWorkflowRuleDto,
  ExecuteWorkflowDto,
} from './dto/workflow-rule.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Workflows')
@Controller('workflows')
@ApiBearerAuth()
export class WorkflowsController {
  constructor(
    private readonly workflowRulesService: WorkflowRulesService,
  ) {}

  @Post()
  @RequirePermissions('workflow:create')
  @ApiOperation({ summary: 'Create a workflow rule' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully' })
  async create(@Body() createDto: CreateWorkflowRuleDto, @Request() req: any) {
    return this.workflowRulesService.create(createDto, req.user.id);
  }

  @Get()
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get all workflow rules' })
  @ApiResponse({ status: 200, description: 'List of workflow rules' })
  async findAll(@Query('tenantId') tenantId: string, @Query('isActive') isActive?: boolean) {
    return this.workflowRulesService.findAll(tenantId, isActive);
  }

  @Get(':id')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get a workflow rule by ID' })
  @ApiResponse({ status: 200, description: 'Workflow rule details' })
  async findOne(@Param('id') id: string) {
    return this.workflowRulesService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions('workflow:update')
  @ApiOperation({ summary: 'Update a workflow rule' })
  @ApiResponse({ status: 200, description: 'Workflow updated successfully' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateWorkflowRuleDto) {
    return this.workflowRulesService.update(id, updateDto);
  }

  @Delete(':id')
  @RequirePermissions('workflow:delete')
  @ApiOperation({ summary: 'Delete a workflow rule' })
  @ApiResponse({ status: 200, description: 'Workflow deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.workflowRulesService.remove(id);
  }

  @Post(':id/execute')
  @RequirePermissions('workflow:execute')
  @ApiOperation({ summary: 'Execute a workflow rule (test run)' })
  @ApiResponse({ status: 200, description: 'Workflow execution results' })
  async execute(@Param('id') id: string, @Body() executeDto: ExecuteWorkflowDto) {
    return this.workflowRulesService.execute(id, executeDto);
  }

  @Get(':id/logs')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get workflow execution logs' })
  @ApiResponse({ status: 200, description: 'Workflow execution logs' })
  async getLogs(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.workflowRulesService.getLogs(id, limit);
  }
}

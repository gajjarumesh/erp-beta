import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsObject, IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkflowRuleDto {
  @ApiProperty({ example: 'Overdue Invoice Reminder', description: 'Workflow name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Workflow description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Trigger configuration',
    example: {
      type: 'on_update',
      entity: 'invoice',
      config: { fields: ['status'] },
    },
  })
  @IsObject()
  trigger: Record<string, any>;

  @ApiProperty({
    description: 'Conditions for workflow execution',
    example: {
      operator: 'AND',
      conditions: [
        { field: 'dueDate', operator: '<', value: 'now' },
        { field: 'balance', operator: '>', value: 0 },
      ],
    },
  })
  @IsObject()
  conditions: Record<string, any>;

  @ApiProperty({
    description: 'Actions to execute',
    type: 'array',
    example: [
      {
        type: 'send_email',
        config: {
          template: 'overdue_invoice',
          to: '{{customer.email}}',
        },
      },
    ],
  })
  @IsArray()
  actions: Record<string, any>[];

  @ApiPropertyOptional({ example: true, description: 'Is workflow active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'tenant-uuid', description: 'Tenant ID' })
  @IsUUID()
  tenantId: string;
}

export class UpdateWorkflowRuleDto {
  @ApiPropertyOptional({ example: 'Overdue Invoice Reminder', description: 'Workflow name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Workflow description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Trigger configuration' })
  @IsOptional()
  @IsObject()
  trigger?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Conditions for workflow execution' })
  @IsOptional()
  @IsObject()
  conditions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Actions to execute' })
  @IsOptional()
  @IsArray()
  actions?: Record<string, any>[];

  @ApiPropertyOptional({ example: true, description: 'Is workflow active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ExecuteWorkflowDto {
  @ApiProperty({ description: 'Entity data to test workflow with' })
  @IsObject()
  entityData: Record<string, any>;

  @ApiPropertyOptional({ example: false, description: 'Dry run mode (no actions executed)' })
  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}

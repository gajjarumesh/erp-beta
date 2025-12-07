import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowRule, WorkflowLog } from '../../database/entities';
import { WorkflowsController } from './workflows.controller';
import { WorkflowRulesService } from './workflow-rules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowRule, WorkflowLog]),
  ],
  controllers: [WorkflowsController],
  providers: [WorkflowRulesService],
  exports: [WorkflowRulesService],
})
export class WorkflowsModule {}

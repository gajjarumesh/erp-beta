import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company, Contact, Lead, Opportunity, Pipeline, Stage } from '../../database/entities';
import { CrmController } from './crm.controller';
import { CompaniesService } from './companies.service';
import { ContactsService } from './contacts.service';
import { LeadsService } from './leads.service';
import { OpportunitiesService } from './opportunities.service';
import { PipelinesService } from './pipelines.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Contact, Lead, Opportunity, Pipeline, Stage]),
  ],
  controllers: [CrmController],
  providers: [CompaniesService, ContactsService, LeadsService, OpportunitiesService, PipelinesService],
  exports: [CompaniesService, ContactsService, LeadsService, OpportunitiesService, PipelinesService],
})
export class CrmModule {}

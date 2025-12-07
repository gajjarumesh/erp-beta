import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { CompaniesService, ContactsService, LeadsService, OpportunitiesService, PipelinesService } from './';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CreateContactDto,
  UpdateContactDto,
  CreateLeadDto,
  UpdateLeadDto,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  CreatePipelineDto,
  UpdatePipelineDto,
  CreateStageDto,
  UpdateStageDto,
} from './dto';
import { CompanyType, LeadStatus } from '../../database/entities';

@ApiTags('crm')
@Controller('crm')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CrmController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly contactsService: ContactsService,
    private readonly leadsService: LeadsService,
    private readonly opportunitiesService: OpportunitiesService,
    private readonly pipelinesService: PipelinesService,
  ) {}

  // ==================== COMPANIES ====================
  @Post('companies')
  @ApiOperation({ summary: 'Create a new company' })
  @RequirePermissions('crm:company:create')
  async createCompany(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateCompanyDto) {
    const company = await this.companiesService.create(tenantId, dto);
    return { success: true, data: company };
  }

  @Get('companies')
  @ApiOperation({ summary: 'List all companies' })
  @ApiQuery({ name: 'type', enum: CompanyType, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('crm:company:read')
  async listCompanies(
    @CurrentUser('tenantId') tenantId: string,
    @Query('type') type?: CompanyType,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.companiesService.findAll(tenantId, {
      type,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('companies/:id')
  @ApiOperation({ summary: 'Get company by ID' })
  @RequirePermissions('crm:company:read')
  async getCompany(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const company = await this.companiesService.findOne(tenantId, id);
    return { success: true, data: company };
  }

  @Put('companies/:id')
  @ApiOperation({ summary: 'Update company' })
  @RequirePermissions('crm:company:update')
  async updateCompany(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.update(tenantId, id, dto);
    return { success: true, data: company };
  }

  @Delete('companies/:id')
  @ApiOperation({ summary: 'Delete company' })
  @RequirePermissions('crm:company:delete')
  async deleteCompany(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.companiesService.remove(tenantId, id);
    return { success: true, message: 'Company deleted successfully' };
  }

  // ==================== CONTACTS ====================
  @Post('contacts')
  @ApiOperation({ summary: 'Create a new contact' })
  @RequirePermissions('crm:contact:create')
  async createContact(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateContactDto) {
    const contact = await this.contactsService.create(tenantId, dto);
    return { success: true, data: contact };
  }

  @Get('contacts')
  @ApiOperation({ summary: 'List all contacts' })
  @ApiQuery({ name: 'companyId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('crm:contact:read')
  async listContacts(
    @CurrentUser('tenantId') tenantId: string,
    @Query('companyId') companyId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.contactsService.findAll(tenantId, {
      companyId,
      search,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('contacts/:id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @RequirePermissions('crm:contact:read')
  async getContact(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const contact = await this.contactsService.findOne(tenantId, id);
    return { success: true, data: contact };
  }

  @Put('contacts/:id')
  @ApiOperation({ summary: 'Update contact' })
  @RequirePermissions('crm:contact:update')
  async updateContact(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    const contact = await this.contactsService.update(tenantId, id, dto);
    return { success: true, data: contact };
  }

  @Delete('contacts/:id')
  @ApiOperation({ summary: 'Delete contact' })
  @RequirePermissions('crm:contact:delete')
  async deleteContact(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.contactsService.remove(tenantId, id);
    return { success: true, message: 'Contact deleted successfully' };
  }

  // ==================== LEADS ====================
  @Post('leads')
  @ApiOperation({ summary: 'Create a new lead' })
  @RequirePermissions('crm:lead:create')
  async createLead(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateLeadDto) {
    const lead = await this.leadsService.create(tenantId, dto);
    return { success: true, data: lead };
  }

  @Get('leads')
  @ApiOperation({ summary: 'List all leads' })
  @ApiQuery({ name: 'status', enum: LeadStatus, required: false })
  @ApiQuery({ name: 'ownerUserId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('crm:lead:read')
  async listLeads(
    @CurrentUser('tenantId') tenantId: string,
    @Query('status') status?: LeadStatus,
    @Query('ownerUserId') ownerUserId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.leadsService.findAll(tenantId, {
      status,
      ownerUserId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('leads/:id')
  @ApiOperation({ summary: 'Get lead by ID' })
  @RequirePermissions('crm:lead:read')
  async getLead(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const lead = await this.leadsService.findOne(tenantId, id);
    return { success: true, data: lead };
  }

  @Put('leads/:id')
  @ApiOperation({ summary: 'Update lead' })
  @RequirePermissions('crm:lead:update')
  async updateLead(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    const lead = await this.leadsService.update(tenantId, id, dto);
    return { success: true, data: lead };
  }

  @Put('leads/:id/status')
  @ApiOperation({ summary: 'Update lead status' })
  @RequirePermissions('crm:lead:update')
  async updateLeadStatus(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
  ) {
    const lead = await this.leadsService.updateStatus(tenantId, id, status);
    return { success: true, data: lead };
  }

  @Delete('leads/:id')
  @ApiOperation({ summary: 'Delete lead' })
  @RequirePermissions('crm:lead:delete')
  async deleteLead(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.leadsService.remove(tenantId, id);
    return { success: true, message: 'Lead deleted successfully' };
  }

  // ==================== OPPORTUNITIES ====================
  @Post('opportunities')
  @ApiOperation({ summary: 'Create a new opportunity' })
  @RequirePermissions('crm:opportunity:create')
  async createOpportunity(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateOpportunityDto) {
    const opportunity = await this.opportunitiesService.create(tenantId, dto);
    return { success: true, data: opportunity };
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'List all opportunities' })
  @ApiQuery({ name: 'pipelineId', required: false })
  @ApiQuery({ name: 'stageId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @RequirePermissions('crm:opportunity:read')
  async listOpportunities(
    @CurrentUser('tenantId') tenantId: string,
    @Query('pipelineId') pipelineId?: string,
    @Query('stageId') stageId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.opportunitiesService.findAll(tenantId, {
      pipelineId,
      stageId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
    return { success: true, ...result };
  }

  @Get('opportunities/:id')
  @ApiOperation({ summary: 'Get opportunity by ID' })
  @RequirePermissions('crm:opportunity:read')
  async getOpportunity(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const opportunity = await this.opportunitiesService.findOne(tenantId, id);
    return { success: true, data: opportunity };
  }

  @Put('opportunities/:id')
  @ApiOperation({ summary: 'Update opportunity' })
  @RequirePermissions('crm:opportunity:update')
  async updateOpportunity(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    const opportunity = await this.opportunitiesService.update(tenantId, id, dto);
    return { success: true, data: opportunity };
  }

  @Put('opportunities/:id/stage')
  @ApiOperation({ summary: 'Update opportunity stage' })
  @RequirePermissions('crm:opportunity:update')
  async updateOpportunityStage(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body('stageId') stageId: string,
  ) {
    const opportunity = await this.opportunitiesService.updateStage(tenantId, id, stageId);
    return { success: true, data: opportunity };
  }

  @Delete('opportunities/:id')
  @ApiOperation({ summary: 'Delete opportunity' })
  @RequirePermissions('crm:opportunity:delete')
  async deleteOpportunity(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.opportunitiesService.remove(tenantId, id);
    return { success: true, message: 'Opportunity deleted successfully' };
  }

  // ==================== PIPELINES ====================
  @Post('pipelines')
  @ApiOperation({ summary: 'Create a new pipeline' })
  @RequirePermissions('crm:pipeline:create')
  async createPipeline(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreatePipelineDto) {
    const pipeline = await this.pipelinesService.createPipeline(tenantId, dto);
    return { success: true, data: pipeline };
  }

  @Get('pipelines')
  @ApiOperation({ summary: 'List all pipelines' })
  @RequirePermissions('crm:pipeline:read')
  async listPipelines(@CurrentUser('tenantId') tenantId: string) {
    const pipelines = await this.pipelinesService.findAllPipelines(tenantId);
    return { success: true, data: pipelines };
  }

  @Get('pipelines/:id')
  @ApiOperation({ summary: 'Get pipeline by ID' })
  @RequirePermissions('crm:pipeline:read')
  async getPipeline(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const pipeline = await this.pipelinesService.findOnePipeline(tenantId, id);
    return { success: true, data: pipeline };
  }

  @Put('pipelines/:id')
  @ApiOperation({ summary: 'Update pipeline' })
  @RequirePermissions('crm:pipeline:update')
  async updatePipeline(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePipelineDto,
  ) {
    const pipeline = await this.pipelinesService.updatePipeline(tenantId, id, dto);
    return { success: true, data: pipeline };
  }

  @Delete('pipelines/:id')
  @ApiOperation({ summary: 'Delete pipeline' })
  @RequirePermissions('crm:pipeline:delete')
  async deletePipeline(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.pipelinesService.removePipeline(tenantId, id);
    return { success: true, message: 'Pipeline deleted successfully' };
  }

  // ==================== STAGES ====================
  @Post('stages')
  @ApiOperation({ summary: 'Create a new stage' })
  @RequirePermissions('crm:pipeline:create')
  async createStage(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateStageDto) {
    const stage = await this.pipelinesService.createStage(tenantId, dto);
    return { success: true, data: stage };
  }

  @Get('stages')
  @ApiOperation({ summary: 'List all stages' })
  @ApiQuery({ name: 'pipelineId', required: false })
  @RequirePermissions('crm:pipeline:read')
  async listStages(
    @CurrentUser('tenantId') tenantId: string,
    @Query('pipelineId') pipelineId?: string,
  ) {
    const stages = await this.pipelinesService.findAllStages(tenantId, pipelineId);
    return { success: true, data: stages };
  }

  @Get('stages/:id')
  @ApiOperation({ summary: 'Get stage by ID' })
  @RequirePermissions('crm:pipeline:read')
  async getStage(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    const stage = await this.pipelinesService.findOneStage(tenantId, id);
    return { success: true, data: stage };
  }

  @Put('stages/:id')
  @ApiOperation({ summary: 'Update stage' })
  @RequirePermissions('crm:pipeline:update')
  async updateStage(
    @CurrentUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStageDto,
  ) {
    const stage = await this.pipelinesService.updateStage(tenantId, id, dto);
    return { success: true, data: stage };
  }

  @Delete('stages/:id')
  @ApiOperation({ summary: 'Delete stage' })
  @RequirePermissions('crm:pipeline:delete')
  async deleteStage(@CurrentUser('tenantId') tenantId: string, @Param('id') id: string) {
    await this.pipelinesService.removeStage(tenantId, id);
    return { success: true, message: 'Stage deleted successfully' };
  }
}

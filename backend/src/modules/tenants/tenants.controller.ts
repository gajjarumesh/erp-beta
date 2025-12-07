import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { OnboardTenantDto, UpdateTenantDto } from './dto';
import { Public } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import { RequirePermissions } from '../../common/decorators';

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public()
  @Post('onboard')
  @ApiOperation({ summary: 'Onboard a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @ApiResponse({ status: 409, description: 'Tenant already exists' })
  async onboard(@Body() dto: OnboardTenantDto) {
    const tenant = await this.tenantsService.onboard(dto);
    return {
      success: true,
      data: tenant,
      message: 'Tenant onboarded successfully',
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @RequirePermissions('core:tenants:read')
  async findOne(@Param('id') id: string) {
    const tenant = await this.tenantsService.findOne(id);
    return {
      success: true,
      data: tenant,
    };
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tenant' })
  @ApiResponse({ status: 200, description: 'Tenant updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @RequirePermissions('core:tenants:update')
  async update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    const tenant = await this.tenantsService.update(id, dto);
    return {
      success: true,
      data: tenant,
      message: 'Tenant updated successfully',
    };
  }

  @Put(':id/activate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant activated successfully' })
  @RequirePermissions('core:tenants:update')
  async activate(@Param('id') id: string) {
    const tenant = await this.tenantsService.activate(id);
    return {
      success: true,
      data: tenant,
      message: 'Tenant activated successfully',
    };
  }

  @Put(':id/suspend')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend tenant' })
  @ApiResponse({ status: 200, description: 'Tenant suspended successfully' })
  @RequirePermissions('core:tenants:update')
  async suspend(@Param('id') id: string) {
    const tenant = await this.tenantsService.suspend(id);
    return {
      success: true,
      data: tenant,
      message: 'Tenant suspended successfully',
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PluginsService } from './plugins.service';
import { CreatePluginDto, UpdatePluginDto, ConfigurePluginDto } from './dto/plugin.dto';

@ApiTags('plugins')
@ApiBearerAuth()
@Controller('plugins')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PluginsController {
  constructor(private pluginsService: PluginsService) {}

  // Admin endpoints - manage plugins globally
  @Post()
  @Permissions('admin:system:write')
  @ApiOperation({ summary: 'Create new plugin (Admin)' })
  async createPlugin(@Body() createDto: CreatePluginDto) {
    return await this.pluginsService.createPlugin(createDto);
  }

  @Get('available')
  @Permissions('plugins:read')
  @ApiOperation({ summary: 'List all available plugins' })
  async getAvailablePlugins() {
    return await this.pluginsService.findAllPlugins();
  }

  @Get(':key')
  @Permissions('plugins:read')
  @ApiOperation({ summary: 'Get plugin by key' })
  async getPlugin(@Param('key') key: string) {
    return await this.pluginsService.findPluginByKey(key);
  }

  @Put(':key')
  @Permissions('admin:system:write')
  @ApiOperation({ summary: 'Update plugin (Admin)' })
  async updatePlugin(
    @Param('key') key: string,
    @Body() updateDto: UpdatePluginDto,
  ) {
    return await this.pluginsService.updatePlugin(key, updateDto);
  }

  @Delete(':key')
  @Permissions('admin:system:write')
  @ApiOperation({ summary: 'Delete plugin (Admin)' })
  async deletePlugin(@Param('key') key: string) {
    await this.pluginsService.deletePlugin(key);
    return { message: 'Plugin deleted successfully' };
  }

  // Tenant endpoints - configure plugins per tenant
  @Get('tenant/list')
  @Permissions('plugins:read')
  @ApiOperation({ summary: 'List plugins for current tenant' })
  async getTenantPlugins(@Request() req: any) {
    return await this.pluginsService.getPluginsForTenant(req.user.tenantId);
  }

  @Post('tenant/:key/configure')
  @Permissions('plugins:update')
  @ApiOperation({ summary: 'Configure plugin for tenant' })
  async configurePlugin(
    @Request() req: any,
    @Param('key') key: string,
    @Body() configDto: ConfigurePluginDto,
  ) {
    return await this.pluginsService.configurePlugin(
      req.user.tenantId,
      key,
      configDto,
    );
  }

  @Get('tenant/:key/config')
  @Permissions('plugins:read')
  @ApiOperation({ summary: 'Get plugin configuration for tenant' })
  async getPluginConfig(@Request() req: any, @Param('key') key: string) {
    return await this.pluginsService.getPluginConfig(req.user.tenantId, key);
  }

  @Post('tenant/:key/toggle')
  @Permissions('plugins:update')
  @ApiOperation({ summary: 'Enable/disable plugin for tenant' })
  async togglePlugin(
    @Request() req: any,
    @Param('key') key: string,
    @Body() body: { isEnabled: boolean },
  ) {
    return await this.pluginsService.togglePlugin(
      req.user.tenantId,
      key,
      body.isEnabled,
    );
  }

  @Get('tenant/enabled')
  @Permissions('plugins:read')
  @ApiOperation({ summary: 'Get enabled plugins for tenant' })
  async getEnabledPlugins(@Request() req: any) {
    return await this.pluginsService.getEnabledPlugins(req.user.tenantId);
  }
}

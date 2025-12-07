import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserData, RequirePermissions } from '../../common/decorators';
import { SettingsScope } from '../../database/entities';

@ApiTags('settings')
@Controller('settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get settings by scope' })
  @RequirePermissions('core:settings:read')
  async findByScope(
    @CurrentUser() user: CurrentUserData,
    @Query('scope') scope: SettingsScope,
  ) {
    const settings = await this.settingsService.findByScope(
      user.tenantId,
      scope || SettingsScope.TENANT,
    );
    return { success: true, data: settings };
  }

  @Put()
  @ApiOperation({ summary: 'Update or create setting' })
  @RequirePermissions('core:settings:update')
  async upsert(@CurrentUser() user: CurrentUserData, @Body() dto: UpdateSettingsDto) {
    const setting = await this.settingsService.upsert(user.tenantId, dto);
    return { success: true, data: setting, message: 'Setting updated successfully' };
  }
}

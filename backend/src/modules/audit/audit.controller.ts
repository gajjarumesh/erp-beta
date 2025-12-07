import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, CurrentUserData, RequirePermissions } from '../../common/decorators';

@ApiTags('audit')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get audit logs' })
  @RequirePermissions('core:audit:read')
  async findAll(
    @CurrentUser() user: CurrentUserData,
    @Query('action') action?: string,
    @Query('objectType') objectType?: string,
    @Query('actorUserId') actorUserId?: string,
  ) {
    const logs = await this.auditService.findAll(user.tenantId, {
      action,
      objectType,
      actorUserId,
    });
    return { success: true, data: logs };
  }
}

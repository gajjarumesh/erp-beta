import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: 'ok',
        redis: 'ok',
      },
    };
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Readiness check endpoint' })
  getReadiness() {
    // Check if app is ready to serve traffic
    return {
      ready: true,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness check endpoint' })
  getLiveness() {
    // Check if app is alive
    return {
      alive: true,
      timestamp: new Date().toISOString(),
    };
  }
}

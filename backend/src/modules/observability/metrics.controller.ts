import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PrometheusService } from './prometheus.service';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private prometheusService: PrometheusService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  async getMetrics() {
    return await this.prometheusService.getMetrics();
  }
}

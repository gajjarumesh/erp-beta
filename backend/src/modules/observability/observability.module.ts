import { Module, Global } from '@nestjs/common';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { PrometheusService } from './prometheus.service';

@Global()
@Module({
  controllers: [HealthController, MetricsController],
  providers: [PrometheusService],
  exports: [PrometheusService],
})
export class ObservabilityModule {}

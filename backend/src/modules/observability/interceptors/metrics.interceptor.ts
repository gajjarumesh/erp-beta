import { Injectable, Logger, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrometheusService } from '../prometheus.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);

  constructor(private prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = (Date.now() - startTime) / 1000; // Convert to seconds
          
          this.prometheusService.recordHttpRequest(
            request.method,
            request.route?.path || request.path,
            response.statusCode,
            duration,
          );
        },
        error: (error) => {
          const duration = (Date.now() - startTime) / 1000;
          
          this.prometheusService.recordHttpRequest(
            request.method,
            request.route?.path || request.path,
            error.status || 500,
            duration,
          );
        },
      }),
    );
  }
}

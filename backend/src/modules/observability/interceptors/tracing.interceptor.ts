import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TracingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Generate correlation ID if not present
    const correlationId = request.headers['x-correlation-id'] || uuidv4();
    request.correlationId = correlationId;

    const traceId = request.headers['x-trace-id'] || uuidv4();
    const spanId = uuidv4();

    // Store tracing context in request
    request.traceContext = {
      traceId,
      spanId,
      correlationId,
      parentSpanId: request.headers['x-parent-span-id'],
    };

    const startTime = Date.now();
    const method = request.method;
    const url = request.url;

    // Log request start with tracing context
    this.logger.log({
      message: 'HTTP Request Started',
      correlationId,
      traceId,
      spanId,
      method,
      url,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse();
          const duration = Date.now() - startTime;

          // Set tracing headers in response
          response.setHeader('X-Correlation-Id', correlationId);
          response.setHeader('X-Trace-Id', traceId);

          // Log request completion with tracing context
          this.logger.log({
            message: 'HTTP Request Completed',
            correlationId,
            traceId,
            spanId,
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;

          // Log error with tracing context
          this.logger.error({
            message: 'HTTP Request Failed',
            correlationId,
            traceId,
            spanId,
            method,
            url,
            error: error.message,
            stack: error.stack,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }
}

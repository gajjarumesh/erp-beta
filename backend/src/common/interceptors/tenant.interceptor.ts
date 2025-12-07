import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.tenantId) {
      // Set tenant context for RLS using parameterized query
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      
      try {
        // Use parameterized query to prevent SQL injection
        await queryRunner.query('SET app.current_tenant = $1', [user.tenantId]);
      } finally {
        await queryRunner.release();
      }
    }

    return next.handle();
  }
}

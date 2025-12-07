import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../database/entities';

const AUDITABLE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const AUDITABLE_ENTITIES = ['tenant', 'user', 'role', 'settings'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    
    // Only audit write operations
    if (!AUDITABLE_METHODS.includes(method)) {
      return next.handle();
    }

    const user = request.user;
    const path = request.route?.path || request.url;
    const before = request.body;

    return next.handle().pipe(
      tap(async (after) => {
        // Extract entity info from path
        const entityMatch = path.match(/\/api\/v1\/(\w+)/);
        if (!entityMatch) return;

        const entityType = entityMatch[1];
        
        // Only audit configured entities
        if (!AUDITABLE_ENTITIES.includes(entityType)) return;

        if (user && user.tenantId) {
          const action = this.getActionFromMethod(method);
          
          try {
            await this.auditLogRepository.save({
              tenantId: user.tenantId,
              actorUserId: user.userId,
              action,
              objectType: entityType,
              objectId: after?.id || before?.id,
              before: method !== 'POST' ? before : null,
              after: method !== 'DELETE' ? after : null,
            });
          } catch (error) {
            // Don't fail the request if audit logging fails
            console.error('Audit logging error:', error);
          }
        }
      }),
    );
  }

  private getActionFromMethod(method: string): string {
    const actionMap: Record<string, string> = {
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };
    return actionMap[method] || 'unknown';
  }
}

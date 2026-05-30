import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { PaginatedResult } from '../interfaces/api-response.interface';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((result) => {
        if (result === undefined || result === null) {
          return undefined;
        }

        if (this.isPaginatedResult(result)) {
          return {
            success: true,
            data: result.data,
            pagination: result.pagination,
          };
        }

        return { success: true, data: result };
      }),
    );
  }

  private isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
    return (
      typeof value === 'object'
      && value !== null
      && 'data' in value
      && 'pagination' in value
      && Array.isArray((value as PaginatedResult<unknown>).data)
    );
  }
}

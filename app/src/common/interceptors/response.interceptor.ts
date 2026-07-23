import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponsePayload<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponsePayload<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponsePayload<T>> {
    const ctx = context.switchToHttp();
    const statusCode = ctx.getResponse().statusCode;

    return next.handle().pipe(
      map((result) => {
        // If service returns { data, meta } shape (paginated), unwrap it
        if (result && typeof result === 'object' && 'data' in result && 'meta' in result) {
          return {
            success: true,
            statusCode,
            message: result.message || 'Success',
            data: result.data,
            meta: result.meta,
          };
        }

        return {
          success: true,
          statusCode,
          message: result?.message || 'Success',
          data: result?.data !== undefined ? result.data : result,
        };
      }),
    );
  }
}

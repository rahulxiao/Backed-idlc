import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || exception.message;
      error = exception.constructor.name;
    } else if (exception instanceof QueryFailedError) {
      const pg = exception as any;
      // PostgreSQL unique constraint violation code: 23505
      if (pg.code === '23505') {
        statusCode = HttpStatus.CONFLICT;
        error = 'ConflictException';
        // Parse constraint detail to produce readable message
        const detail: string = pg.detail || '';
        const match = detail.match(/\(([^)]+)\)/);
        const field = match ? match[1] : 'field';
        message = `A record with this ${field} already exists`;
      } else {
        this.logger.error('Database error', exception);
        message = 'Database error occurred';
      }
    } else {
      this.logger.error('Unhandled exception', exception);
    }

    response.status(statusCode).json({
      success: false,
      statusCode,
      message: Array.isArray(message) ? message.join(', ') : message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

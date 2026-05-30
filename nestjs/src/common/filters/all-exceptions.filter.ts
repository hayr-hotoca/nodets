import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AppException } from '../exceptions/app.exception';
import { ApiErrorBody } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const nodeEnv = this.configService.get<string>('nodeEnv', 'development');

    if (nodeEnv === 'development') {
      console.error('[Error]', exception);
    }

    if (exception instanceof AppException) {
      this.sendError(response, exception.statusCode, exception.code, exception.message, exception.details);
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const message = typeof payload === 'string'
        ? payload
        : (payload as { message?: string | string[] }).message;

      this.sendError(
        response,
        status,
        status === HttpStatus.NOT_FOUND ? 'NOT_FOUND' : 'HTTP_ERROR',
        Array.isArray(message) ? message.join(', ') : (message ?? 'Request failed'),
      );
      return;
    }

    const pgCode = (exception as NodeJS.ErrnoException & { code?: string }).code;

    if (pgCode === '23505') {
      this.sendError(response, 409, 'CONFLICT', 'Dữ liệu đã tồn tại (duplicate key)');
      return;
    }

    if (pgCode === '23503') {
      this.sendError(response, 400, 'BAD_REQUEST', 'Dữ liệu tham chiếu không tồn tại (foreign key)');
      return;
    }

    const message = exception instanceof Error ? exception.message : 'Lỗi hệ thống nội bộ';
    this.sendError(
      response,
      500,
      'INTERNAL_ERROR',
      nodeEnv === 'development' ? message : 'Lỗi hệ thống nội bộ',
    );
  }

  private sendError(
    response: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ): void {
    const body: ApiErrorBody = {
      success: false,
      error: { code, message },
    };

    if (details !== undefined) {
      body.error.details = details;
    }

    response.status(statusCode).json(body);
  }
}

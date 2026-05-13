import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { appConfig } from '../../config/app.config';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (appConfig.nodeEnv === 'development') {
    console.error('[Error]', err);
  }

  if (err instanceof AppError) {
    const body: Record<string, unknown> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    };
    const errWithDetails = err as AppError & { details?: unknown };
    if (errWithDetails.details) {
      (body.error as Record<string, unknown>).details = errWithDetails.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  // PostgreSQL unique violation
  if ((err as NodeJS.ErrnoException & { code?: string }).code === '23505') {
    res.status(409).json({
      success: false,
      error: { code: 'CONFLICT', message: 'Dữ liệu đã tồn tại (duplicate key)' },
    });
    return;
  }

  // PostgreSQL foreign key violation
  if ((err as NodeJS.ErrnoException & { code?: string }).code === '23503') {
    res.status(400).json({
      success: false,
      error: { code: 'BAD_REQUEST', message: 'Dữ liệu tham chiếu không tồn tại (foreign key)' },
    });
    return;
  }

  // Generic fallback
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: appConfig.nodeEnv === 'development' ? err.message : 'Lỗi hệ thống nội bộ',
    },
  });
}

export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} không tồn tại`,
    },
  });
}

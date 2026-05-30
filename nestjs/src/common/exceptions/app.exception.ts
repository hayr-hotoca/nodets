export class AppException extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    details?: unknown,
  ) {
    super(message);
    this.name = 'AppException';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static notFound(message = 'Không tìm thấy dữ liệu'): AppException {
    return new AppException(message, 404, 'NOT_FOUND');
  }

  static badRequest(message: string, details?: unknown): AppException {
    return new AppException(message, 400, 'BAD_REQUEST', details);
  }

  static conflict(message: string): AppException {
    return new AppException(message, 409, 'CONFLICT');
  }

  static validation(message: string, details: unknown): AppException {
    return new AppException(message, 400, 'VALIDATION_ERROR', details);
  }
}

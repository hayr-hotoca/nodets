import { PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { AppException } from '../exceptions/app.exception';
import { ValidationDetail } from '../interfaces/api-response.interface';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown): unknown {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const details: ValidationDetail[] = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        throw AppException.validation('Dữ liệu đầu vào không hợp lệ', details);
      }

      throw error;
    }
  }
}

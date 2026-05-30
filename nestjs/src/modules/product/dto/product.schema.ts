import { z } from 'zod';

export const CreateProductSchema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(300),
  description: z.string().optional(),
  calculation_unit: z.string().min(1).max(30).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const ListProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
export type ListProductQueryDto = z.infer<typeof ListProductQuerySchema>;

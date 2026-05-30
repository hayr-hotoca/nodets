import { z } from 'zod';

export const CreateDivisionSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
  unit_id: z.number().int().positive(),
});

export const UpdateDivisionSchema = CreateDivisionSchema.partial();

export const ListDivisionQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  unit_id: z.coerce.number().int().positive().optional(),
});

export type CreateDivisionDto = z.infer<typeof CreateDivisionSchema>;
export type UpdateDivisionDto = z.infer<typeof UpdateDivisionSchema>;
export type ListDivisionQueryDto = z.infer<typeof ListDivisionQuerySchema>;

import { z } from 'zod';

export const CreateUnitSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
});

export const UpdateUnitSchema = CreateUnitSchema.partial();

export const ListUnitQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export type CreateUnitDto = z.infer<typeof CreateUnitSchema>;
export type UpdateUnitDto = z.infer<typeof UpdateUnitSchema>;
export type ListUnitQueryDto = z.infer<typeof ListUnitQuerySchema>;

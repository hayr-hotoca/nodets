import { z } from 'zod';

export const CreateWarehouseSchema = z.object({
  code: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
  location: z.string().max(300).optional(),
  address: z.string().optional(),
  manager_name: z.string().max(150).optional(),
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const ListWarehouseQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  is_active: z.enum(['true', 'false']).optional(),
});

export type CreateWarehouseDto = z.infer<typeof CreateWarehouseSchema>;
export type UpdateWarehouseDto = z.infer<typeof UpdateWarehouseSchema>;
export type ListWarehouseQueryDto = z.infer<typeof ListWarehouseQuerySchema>;

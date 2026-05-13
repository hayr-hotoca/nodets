import { z } from 'zod';

// ─── Entity ───────────────────────────────────────────────
export interface Division {
  id: number;
  code: string;
  name: string;
  unit_id: number;
  unit_name?: string;
  created_at: Date;
  updated_at: Date;
}

// ─── Zod Schemas ──────────────────────────────────────────
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

// ─── DTOs ─────────────────────────────────────────────────
export type CreateDivisionDto = z.infer<typeof CreateDivisionSchema>;
export type UpdateDivisionDto = z.infer<typeof UpdateDivisionSchema>;
export type ListDivisionQuery = z.infer<typeof ListDivisionQuerySchema>;

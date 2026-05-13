import { z } from 'zod';

// ─── Entities ─────────────────────────────────────────────
export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  calculation_unit: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductStockSummary {
  id: number;
  product_id: number;
  total_actual_qty: number;
  total_document_qty: number;
  created_at: Date;
  updated_at: Date;
}

// ─── Zod Schemas ──────────────────────────────────────────
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

// ─── DTOs ─────────────────────────────────────────────────
export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
export type ListProductQuery = z.infer<typeof ListProductQuerySchema>;

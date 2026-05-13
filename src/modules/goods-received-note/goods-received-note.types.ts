import { z } from 'zod';

// ─── Entities ─────────────────────────────────────────────
export interface GoodsReceivedNoteProduct {
  id: number;
  grn_id: number;
  product_id: number;
  product_name?: string;
  product_code?: string;
  qty_actual: number;
  qty_document: number;
  unit_price: number;
  total_amount: number;
  total_amount_in_words: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface GoodsReceivedNote {
  id: number;
  receipt_date: string;         // ISO date string
  deliverer_name: string | null;
  preparer_name: string | null;
  storekeeper_name: string | null;
  chief_accountant_name: string | null;
  delivery_date: string | null;
  warehouse_id: number;
  warehouse_name?: string;
  division_id: number | null;
  ref_doc_type: string | null;
  ref_doc_number: string | null;
  ref_doc_date: string | null;
  ref_doc_issuer: string | null;
  debit_amount: number;         // Số tiền nợ
  credit_amount: number;        // Số tiền có
  source_documents: number | null; // Dạng số
  created_at: Date;
  updated_at: Date;
  products?: GoodsReceivedNoteProduct[];
}

// ─── Zod Schemas ──────────────────────────────────────────
export const GRNProductSchema = z.object({
  product_id: z.number().int().positive(),
  qty_actual: z.number().min(0),
  qty_document: z.number().min(0),
  unit_price: z.number().min(0),
});

export const CreateGoodsReceivedNoteSchema = z.object({
  receipt_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD'),
  deliverer_name: z.string().max(200).optional().nullable(),
  preparer_name: z.string().max(200).optional().nullable(),
  storekeeper_name: z.string().max(200).optional().nullable(),
  chief_accountant_name: z.string().max(200).optional().nullable(),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày phải là YYYY-MM-DD').optional().nullable(),
  warehouse_id: z.number().int().positive(),
  division_id: z.number().int().positive().optional().nullable(),
  ref_doc_type: z.string().max(100).optional(),
  ref_doc_number: z.string().max(50).optional(),
  ref_doc_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ref_doc_issuer: z.string().max(200).optional(),
  debit_amount: z.number().min(0).optional(),
  credit_amount: z.number().min(0).optional(),
  source_documents: z.number().int().min(0).optional(),
  products: z.array(GRNProductSchema).min(1, 'Phiếu nhập kho phải có ít nhất 1 sản phẩm'),
});

export const UpdateGoodsReceivedNoteSchema = CreateGoodsReceivedNoteSchema.partial();

export const ListGoodsReceivedNoteQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  warehouse_id: z.coerce.number().int().positive().optional(),
  division_id: z.coerce.number().int().positive().optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  search: z.string().optional(),
});

export type Receipt = GoodsReceivedNote; 
export type CreateReceiptDto = z.infer<typeof CreateGoodsReceivedNoteSchema>;
export type UpdateReceiptDto = z.infer<typeof UpdateGoodsReceivedNoteSchema>;
export type ListReceiptQuery = z.infer<typeof ListGoodsReceivedNoteQuerySchema>;

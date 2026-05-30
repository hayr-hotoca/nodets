import { z } from 'zod';

export const GrnProductSchema = z.object({
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
  products: z.array(GrnProductSchema).min(1, 'Phiếu nhập kho phải có ít nhất 1 sản phẩm'),
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

export type CreateGoodsReceivedNoteDto = z.infer<typeof CreateGoodsReceivedNoteSchema>;
export type UpdateGoodsReceivedNoteDto = z.infer<typeof UpdateGoodsReceivedNoteSchema>;
export type ListGoodsReceivedNoteQueryDto = z.infer<typeof ListGoodsReceivedNoteQuerySchema>;

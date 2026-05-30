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
  receipt_date: string;
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
  debit_amount: number;
  credit_amount: number;
  source_documents: number | null;
  created_at: Date;
  updated_at: Date;
  products?: GoodsReceivedNoteProduct[];
}

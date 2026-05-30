export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  calculation_unit: string | null;
  created_at: Date;
  updated_at: Date;
  total_actual_qty?: number;
  total_document_qty?: number;
}

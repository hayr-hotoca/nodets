export interface Product {
  id: number;
  code: string;
  name: string;
  calculation_unit: string | null;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location?: string;
  address?: string;
}

export interface Unit {
  id: number;
  code: string;
  name: string;
}

export interface Division {
  id: number;
  code: string;
  name: string;
  unit_id: number;
}

export interface GRNProductDto {
  id?: number | string;
  product_id: number;
  qty_actual: number;
  qty_document: number;
  unit_price: number;
}

export interface CreateGRNDto {
  receipt_date: string;
  deliverer_name: string;
  preparer_name: string;
  storekeeper_name: string;
  chief_accountant_name: string;
  warehouse_id: number;
  division_id?: number;
  debit_amount: number;
  credit_amount: number;
  source_documents: number;
  ref_doc_type?: string;
  ref_doc_number?: string;
  ref_doc_date?: string;
  ref_doc_issuer?: string;
  products: GRNProductDto[];
}

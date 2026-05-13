// =============================================
// Shared TypeScript Types & Interfaces
// =============================================

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiItemResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type RecordStatus = 'draft' | 'confirmed' | 'cancelled';
export type TransactionType = 'receipt' | 'issue' | 'adjustment' | 'return';
export type UserRole = 'admin' | 'manager' | 'staff';

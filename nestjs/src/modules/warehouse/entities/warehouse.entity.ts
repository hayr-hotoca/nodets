export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string | null;
  address: string | null;
  manager_name: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

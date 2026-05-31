export interface Division {
  id: number;
  code: string;
  name: string;
  unit_id: number | null;
  unit_name?: string;
  created_at: Date;
  updated_at: Date;
}

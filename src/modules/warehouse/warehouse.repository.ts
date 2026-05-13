import { PoolClient } from 'pg';
import { query } from '../../db/pool';
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, ListWarehouseQuery } from './warehouse.types';

export class WarehouseRepository {
  async findAll(params: ListWarehouseQuery): Promise<{ rows: Warehouse[]; total: number }> {
    const { page = 1, limit = 20, search, is_active } = params;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(code ILIKE $${idx} OR name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (is_active !== undefined) {
      conditions.push(`is_active = $${idx}`);
      values.push(is_active === 'true');
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM warehouses ${where}`,
      values
    );

    const dataResult = await query<Warehouse>(
      `SELECT * FROM warehouses ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    );

    return { rows: dataResult.rows, total: parseInt(countResult.rows[0].total, 10) };
  }

  async findById(id: number): Promise<Warehouse | null> {
    const result = await query<Warehouse>(
      'SELECT * FROM warehouses WHERE id = $1',
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Warehouse | null> {
    const result = await query<Warehouse>(
      'SELECT * FROM warehouses WHERE code = $1',
      [code]
    );
    return result.rows[0] ?? null;
  }

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const result = await query<Warehouse>(
      `INSERT INTO warehouses (code, name, location, address, manager_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [dto.code, dto.name, dto.location ?? null, dto.address ?? null, dto.manager_name ?? null]
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateWarehouseDto): Promise<Warehouse | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.code !== undefined)         { fields.push(`code = $${idx++}`);         values.push(dto.code); }
    if (dto.name !== undefined)         { fields.push(`name = $${idx++}`);         values.push(dto.name); }
    if (dto.location !== undefined)     { fields.push(`location = $${idx++}`);     values.push(dto.location); }
    if (dto.address !== undefined)      { fields.push(`address = $${idx++}`);      values.push(dto.address); }
    if (dto.manager_name !== undefined) { fields.push(`manager_name = $${idx++}`); values.push(dto.manager_name); }
    if (dto.is_active !== undefined)    { fields.push(`is_active = $${idx++}`);    values.push(dto.is_active); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query<Warehouse>(
      `UPDATE warehouses SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM warehouses WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

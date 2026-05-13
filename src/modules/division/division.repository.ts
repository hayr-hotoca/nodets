import { query } from '../../db/pool';
import { Division, CreateDivisionDto, UpdateDivisionDto, ListDivisionQuery } from './division.types';

export class DivisionRepository {
  async findAll(params: ListDivisionQuery): Promise<{ rows: Division[]; total: number }> {
    const { page = 1, limit = 20, search, unit_id } = params;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(d.code ILIKE $${idx} OR d.name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (unit_id) {
      conditions.push(`d.unit_id = $${idx}`);
      values.push(unit_id);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM divisions d ${where}`,
      values
    );

    const dataResult = await query<Division>(
      `SELECT d.*, u.name as unit_name 
       FROM divisions d
       LEFT JOIN units u ON d.unit_id = u.id
       ${where} 
       ORDER BY d.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    );

    return { rows: dataResult.rows, total: parseInt(countResult.rows[0].total, 10) };
  }

  async findById(id: number): Promise<Division | null> {
    const result = await query<Division>(
      `SELECT d.*, u.name as unit_name 
       FROM divisions d
       LEFT JOIN units u ON d.unit_id = u.id
       WHERE d.id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Division | null> {
    const result = await query<Division>(
      'SELECT * FROM divisions WHERE code = $1',
      [code]
    );
    return result.rows[0] ?? null;
  }

  async create(dto: CreateDivisionDto): Promise<Division> {
    const result = await query<Division>(
      `INSERT INTO divisions (code, name, unit_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.code, dto.name, dto.unit_id]
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateDivisionDto): Promise<Division | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.code !== undefined)    { fields.push(`code = $${idx++}`);    values.push(dto.code); }
    if (dto.name !== undefined)    { fields.push(`name = $${idx++}`);    values.push(dto.name); }
    if (dto.unit_id !== undefined) { fields.push(`unit_id = $${idx++}`); values.push(dto.unit_id); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query<Division>(
      `UPDATE divisions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM divisions WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

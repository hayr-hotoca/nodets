import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  CreateDivisionDto,
  ListDivisionQueryDto,
  UpdateDivisionDto,
} from './dto/division.schema';
import { Division } from './entities/division.entity';

@Injectable()
export class DivisionRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(params: ListDivisionQueryDto): Promise<{ rows: Division[]; total: number }> {
    const { page = 1, limit = 20, search, unit_id: unitId } = params;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(d.code ILIKE $${idx} OR d.name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    if (unitId) {
      conditions.push(`d.unit_id = $${idx}`);
      values.push(unitId);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM divisions d ${where}`,
      values,
    );

    const dataResult = await this.db.query<Division>(
      `SELECT d.*, u.name as unit_name
       FROM divisions d
       LEFT JOIN units u ON d.unit_id = u.id
       ${where}
       ORDER BY d.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset],
    );

    return {
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findById(id: number): Promise<Division | null> {
    const result = await this.db.query<Division>(
      `SELECT d.*, u.name as unit_name
       FROM divisions d
       LEFT JOIN units u ON d.unit_id = u.id
       WHERE d.id = $1`,
      [id],
    );
    return result.rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Division | null> {
    const result = await this.db.query<Division>(
      'SELECT * FROM divisions WHERE code = $1',
      [code],
    );
    return result.rows[0] ?? null;
  }

  async create(dto: CreateDivisionDto): Promise<Division> {
    const result = await this.db.query<Division>(
      `INSERT INTO divisions (code, name, unit_id) VALUES ($1, $2, $3) RETURNING *`,
      [dto.code, dto.name, dto.unit_id],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateDivisionDto): Promise<Division | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.code !== undefined) { fields.push(`code = $${idx++}`); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push(`name = $${idx++}`); values.push(dto.name); }
    if (dto.unit_id !== undefined) { fields.push(`unit_id = $${idx++}`); values.push(dto.unit_id); }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await this.db.query<Division>(
      `UPDATE divisions SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM divisions WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

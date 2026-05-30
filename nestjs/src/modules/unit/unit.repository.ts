import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateUnitDto, ListUnitQueryDto, UpdateUnitDto } from './dto/unit.schema';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(params: ListUnitQueryDto): Promise<{ rows: Unit[]; total: number }> {
    const { page = 1, limit = 20, search } = params;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(code ILIKE $${idx} OR name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM units ${where}`,
      values,
    );

    const dataResult = await this.db.query<Unit>(
      `SELECT * FROM units ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset],
    );

    return {
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findById(id: number): Promise<Unit | null> {
    const result = await this.db.query<Unit>('SELECT * FROM units WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Unit | null> {
    const result = await this.db.query<Unit>('SELECT * FROM units WHERE code = $1', [code]);
    return result.rows[0] ?? null;
  }

  async create(dto: CreateUnitDto): Promise<Unit> {
    const result = await this.db.query<Unit>(
      `INSERT INTO units (code, name) VALUES ($1, $2) RETURNING *`,
      [dto.code, dto.name],
    );
    return result.rows[0];
  }

  async update(id: number, dto: UpdateUnitDto): Promise<Unit | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.code !== undefined) { fields.push(`code = $${idx++}`); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push(`name = $${idx++}`); values.push(dto.name); }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await this.db.query<Unit>(
      `UPDATE units SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM units WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

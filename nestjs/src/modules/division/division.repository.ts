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

    const where: any = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (unitId) {
      where.unit_id = unitId;
    }

    const [total, rows] = await Promise.all([
      this.db.division.count({ where }),
      this.db.division.findMany({
        where,
        include: { unit: { select: { name: true } } },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    const divisionsWithUnitName = rows.map((row) => ({
      ...row,
      unit_name: row.unit?.name ?? null,
    }));

    return {
      rows: divisionsWithUnitName as Division[],
      total,
    };
  }

  async findById(id: number): Promise<Division | null> {
    const row = await this.db.division.findUnique({
      where: { id },
      include: { unit: { select: { name: true } } },
    });

    if (!row) return null;

    return {
      ...row,
      unit_name: row.unit?.name ?? null,
    } as Division;
  }

  async findByCode(code: string): Promise<Division | null> {
    return this.db.division.findUnique({
      where: { code },
    });
  }

  async create(dto: CreateDivisionDto): Promise<Division> {
    return this.db.division.create({
      data: {
        code: dto.code,
        name: dto.name,
        unit_id: dto.unit_id,
      },
    });
  }

  async update(id: number, dto: UpdateDivisionDto): Promise<Division | null> {
    const data: any = {};
    if (dto.code !== undefined) data.code = dto.code;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.unit_id !== undefined) data.unit_id = dto.unit_id;

    if (Object.keys(data).length === 0) {
      return this.findById(id);
    }

    return this.db.division.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.division.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

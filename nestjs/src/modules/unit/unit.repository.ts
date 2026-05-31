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

    const where: any = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.db.unit.count({ where }),
      this.db.unit.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    return {
      rows: rows as Unit[],
      total,
    };
  }

  async findById(id: number): Promise<Unit | null> {
    return this.db.unit.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Unit | null> {
    return this.db.unit.findUnique({
      where: { code },
    });
  }

  async create(dto: CreateUnitDto): Promise<Unit> {
    return this.db.unit.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }

  async update(id: number, dto: UpdateUnitDto): Promise<Unit | null> {
    const data: any = {};
    if (dto.code !== undefined) data.code = dto.code;
    if (dto.name !== undefined) data.name = dto.name;

    if (Object.keys(data).length === 0) {
      return this.findById(id);
    }

    return this.db.unit.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.unit.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

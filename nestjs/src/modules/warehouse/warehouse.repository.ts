import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Warehouse } from './entities/warehouse.entity';
import {
  CreateWarehouseDto,
  ListWarehouseQueryDto,
  UpdateWarehouseDto,
} from './dto/warehouse.schema';

@Injectable()
export class WarehouseRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(params: ListWarehouseQueryDto): Promise<{ rows: Warehouse[]; total: number }> {
    const { page = 1, limit = 20, search, is_active: isActive } = params;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isActive !== undefined) {
      where.is_active = isActive === 'true';
    }

    const [total, rows] = await Promise.all([
      this.db.warehouse.count({ where }),
      this.db.warehouse.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    return {
      rows: rows as Warehouse[],
      total,
    };
  }

  async findById(id: number): Promise<Warehouse | null> {
    return this.db.warehouse.findUnique({
      where: { id },
    });
  }

  async findByCode(code: string): Promise<Warehouse | null> {
    return this.db.warehouse.findUnique({
      where: { code },
    });
  }

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    return this.db.warehouse.create({
      data: {
        code: dto.code,
        name: dto.name,
        location: dto.location,
        address: dto.address,
        manager_name: dto.manager_name,
      },
    });
  }

  async update(id: number, dto: UpdateWarehouseDto): Promise<Warehouse | null> {
    const data: any = {};
    if (dto.code !== undefined) data.code = dto.code;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.manager_name !== undefined) data.manager_name = dto.manager_name;
    if (dto.is_active !== undefined) data.is_active = dto.is_active;

    if (Object.keys(data).length === 0) {
      return this.findById(id);
    }

    return this.db.warehouse.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.warehouse.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

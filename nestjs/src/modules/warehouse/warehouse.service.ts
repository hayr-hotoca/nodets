import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';
import { PaginatedResult } from '../../common/interfaces/api-response.interface';
import {
  CreateWarehouseDto,
  ListWarehouseQueryDto,
  UpdateWarehouseDto,
} from './dto/warehouse.schema';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseRepository } from './warehouse.repository';

@Injectable()
export class WarehouseService {
  constructor(private readonly repository: WarehouseRepository) {}

  async list(params: ListWarehouseQueryDto): Promise<PaginatedResult<Warehouse>> {
    const { rows, total } = await this.repository.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number): Promise<Warehouse> {
    const warehouse = await this.repository.findById(id);
    if (!warehouse) {
      throw AppException.notFound(`Không tìm thấy kho với id=${id}`);
    }
    return warehouse;
  }

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw AppException.conflict(`Mã kho "${dto.code}" đã tồn tại`);
    }
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateWarehouseDto): Promise<Warehouse> {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppException.conflict(`Mã kho "${dto.code}" đã tồn tại`);
      }
    }

    const updated = await this.repository.update(id, dto);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}

import { WarehouseRepository } from './warehouse.repository';
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto, ListWarehouseQuery } from './warehouse.types';
import { AppError } from '../../shared/utils/app-error';
import { PaginationMeta } from '../../shared/types';

export class WarehouseService {
  constructor(private readonly repo: WarehouseRepository) {}

  async list(params: ListWarehouseQuery): Promise<{ data: Warehouse[]; pagination: PaginationMeta }> {
    const { rows, total } = await this.repo.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Warehouse> {
    const warehouse = await this.repo.findById(id);
    if (!warehouse) throw AppError.notFound(`Không tìm thấy kho với id=${id}`);
    return warehouse;
  }

  async create(dto: CreateWarehouseDto): Promise<Warehouse> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) throw AppError.conflict(`Mã kho "${dto.code}" đã tồn tại`);
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateWarehouseDto): Promise<Warehouse> {
    await this.getById(id);
    if (dto.code) {
      const existing = await this.repo.findByCode(dto.code);
      if (existing && existing.id !== id) throw AppError.conflict(`Mã kho "${dto.code}" đã tồn tại`);
    }
    const updated = await this.repo.update(id, dto);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }
}

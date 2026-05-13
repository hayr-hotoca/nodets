import { UnitRepository } from './unit.repository';
import { Unit, CreateUnitDto, UpdateUnitDto, ListUnitQuery } from './unit.types';
import { AppError } from '../../shared/utils/app-error';
import { PaginationMeta } from '../../shared/types';

export class UnitService {
  constructor(private readonly repo: UnitRepository) {}

  async list(params: ListUnitQuery): Promise<{ data: Unit[]; pagination: PaginationMeta }> {
    const { rows, total } = await this.repo.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Unit> {
    const unit = await this.repo.findById(id);
    if (!unit) throw AppError.notFound(`Không tìm thấy đơn vị với id=${id}`);
    return unit;
  }

  async create(dto: CreateUnitDto): Promise<Unit> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) throw AppError.conflict(`Mã đơn vị "${dto.code}" đã tồn tại`);
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateUnitDto): Promise<Unit> {
    await this.getById(id);
    if (dto.code) {
      const existing = await this.repo.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Mã đơn vị "${dto.code}" đã được sử dụng bởi đơn vị khác`);
      }
    }
    const updated = await this.repo.update(id, dto);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }
}

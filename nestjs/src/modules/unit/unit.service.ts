import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';
import { PaginatedResult } from '../../common/interfaces/api-response.interface';
import { CreateUnitDto, ListUnitQueryDto, UpdateUnitDto } from './dto/unit.schema';
import { Unit } from './entities/unit.entity';
import { UnitRepository } from './unit.repository';

@Injectable()
export class UnitService {
  constructor(private readonly repository: UnitRepository) {}

  async list(params: ListUnitQueryDto): Promise<PaginatedResult<Unit>> {
    const { rows, total } = await this.repository.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Unit> {
    const unit = await this.repository.findById(id);
    if (!unit) {
      throw AppException.notFound(`Không tìm thấy đơn vị với id=${id}`);
    }
    return unit;
  }

  async create(dto: CreateUnitDto): Promise<Unit> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw AppException.conflict(`Mã đơn vị "${dto.code}" đã tồn tại`);
    }
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateUnitDto): Promise<Unit> {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppException.conflict(`Mã đơn vị "${dto.code}" đã được sử dụng bởi đơn vị khác`);
      }
    }

    return (await this.repository.update(id, dto))!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}

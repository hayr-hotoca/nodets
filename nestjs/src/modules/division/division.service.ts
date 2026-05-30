import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';
import { PaginatedResult } from '../../common/interfaces/api-response.interface';
import {
  CreateDivisionDto,
  ListDivisionQueryDto,
  UpdateDivisionDto,
} from './dto/division.schema';
import { Division } from './entities/division.entity';
import { DivisionRepository } from './division.repository';

@Injectable()
export class DivisionService {
  constructor(private readonly repository: DivisionRepository) {}

  async list(params: ListDivisionQueryDto): Promise<PaginatedResult<Division>> {
    const { rows, total } = await this.repository.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Division> {
    const division = await this.repository.findById(id);
    if (!division) {
      throw AppException.notFound(`Không tìm thấy bộ phận với id=${id}`);
    }
    return division;
  }

  async create(dto: CreateDivisionDto): Promise<Division> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw AppException.conflict(`Mã bộ phận "${dto.code}" đã tồn tại`);
    }
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateDivisionDto): Promise<Division> {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppException.conflict(`Mã bộ phận "${dto.code}" đã được sử dụng bởi bộ phận khác`);
      }
    }

    return (await this.repository.update(id, dto))!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}

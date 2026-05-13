import { DivisionRepository } from './division.repository';
import { Division, CreateDivisionDto, UpdateDivisionDto, ListDivisionQuery } from './division.types';
import { AppError } from '../../shared/utils/app-error';
import { PaginationMeta } from '../../shared/types';

export class DivisionService {
  constructor(private readonly repo: DivisionRepository) {}

  async list(params: ListDivisionQuery): Promise<{ data: Division[]; pagination: PaginationMeta }> {
    const { rows, total } = await this.repo.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Division> {
    const division = await this.repo.findById(id);
    if (!division) throw AppError.notFound(`Không tìm thấy bộ phận với id=${id}`);
    return division;
  }

  async create(dto: CreateDivisionDto): Promise<Division> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) throw AppError.conflict(`Mã bộ phận "${dto.code}" đã tồn tại`);
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateDivisionDto): Promise<Division> {
    await this.getById(id);
    if (dto.code) {
      const existing = await this.repo.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppError.conflict(`Mã bộ phận "${dto.code}" đã được sử dụng bởi bộ phận khác`);
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

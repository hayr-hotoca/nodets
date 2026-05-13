import { ProductRepository } from './product.repository';
import { Product, CreateProductDto, UpdateProductDto, ListProductQuery } from './product.types';
import { AppError } from '../../shared/utils/app-error';
import { PaginationMeta } from '../../shared/types';

export class ProductService {
  constructor(private readonly repo: ProductRepository) {}

  async list(params: ListProductQuery): Promise<{ data: Product[]; pagination: PaginationMeta }> {
    const { rows, total } = await this.repo.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw AppError.notFound(`Không tìm thấy vật tư/hàng hoá với id=${id}`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) throw AppError.conflict(`Mã số "${dto.code}" đã tồn tại`);
    return this.repo.create(dto);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.getById(id);
    if (dto.code) {
      const existing = await this.repo.findByCode(dto.code);
      if (existing && existing.id !== id) throw AppError.conflict(`Mã số "${dto.code}" đã tồn tại`);
    }
    const updated = await this.repo.update(id, dto);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }
}

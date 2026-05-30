import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';
import { PaginatedResult } from '../../common/interfaces/api-response.interface';
import {
  CreateProductDto,
  ListProductQueryDto,
  UpdateProductDto,
} from './dto/product.schema';
import { Product } from './entities/product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async list(params: ListProductQueryDto): Promise<PaginatedResult<Product>> {
    const { rows, total } = await this.repository.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw AppException.notFound(`Không tìm thấy vật tư/hàng hoá với id=${id}`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw AppException.conflict(`Mã số "${dto.code}" đã tồn tại`);
    }
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.getById(id);

    if (dto.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw AppException.conflict(`Mã số "${dto.code}" đã tồn tại`);
      }
    }

    return (await this.repository.update(id, dto))!;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  CreateProductDto,
  ListProductQueryDto,
  UpdateProductDto,
} from './dto/product.schema';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(params: ListProductQueryDto): Promise<{ rows: Product[]; total: number }> {
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
      this.db.product.count({ where }),
      this.db.product.findMany({
        where,
        include: {
          stockSummary: {
            select: {
              total_actual_qty: true,
              total_document_qty: true,
            },
          },
        },
        orderBy: { code: 'asc' },
        take: limit,
        skip: offset,
      }),
    ]);

    const productsWithStock = rows.map((row) => ({
      ...row,
      total_actual_qty: row.stockSummary?.total_actual_qty ?? 0,
      total_document_qty: row.stockSummary?.total_document_qty ?? 0,
    }));

    return {
      rows: productsWithStock as Product[],
      total,
    };
  }

  async findById(id: number): Promise<Product | null> {
    const row = await this.db.product.findUnique({
      where: { id },
      include: {
        stockSummary: {
          select: {
            total_actual_qty: true,
            total_document_qty: true,
          },
        },
      },
    });

    if (!row) return null;

    return {
      ...row,
      total_actual_qty: row.stockSummary?.total_actual_qty ?? 0,
      total_document_qty: row.stockSummary?.total_document_qty ?? 0,
    } as Product;
  }

  async findByCode(code: string): Promise<Product | null> {
    return this.db.product.findUnique({
      where: { code },
    });
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return this.db.withTransaction(async () => {
      const product = await this.db.product.create({
        data: {
          code: dto.code,
          name: dto.name,
          description: dto.description,
          calculation_unit: dto.calculation_unit,
        },
      });

      await this.db.productStockSummary.create({
        data: {
          product_id: product.id,
        },
      });

      return product;
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    const data: any = {};
    if (dto.code !== undefined) data.code = dto.code;
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.calculation_unit !== undefined) data.calculation_unit = dto.calculation_unit;

    if (Object.keys(data).length === 0) {
      return this.findById(id);
    }

    return this.db.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

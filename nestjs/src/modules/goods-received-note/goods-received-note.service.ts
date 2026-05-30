import { Injectable } from '@nestjs/common';
import { AppException } from '../../common/exceptions/app.exception';
import { PaginatedResult } from '../../common/interfaces/api-response.interface';
import {
  CreateGoodsReceivedNoteDto,
  ListGoodsReceivedNoteQueryDto,
  UpdateGoodsReceivedNoteDto,
} from './dto/goods-received-note.schema';
import { GoodsReceivedNote } from './entities/goods-received-note.entity';
import { GoodsReceivedNoteRepository } from './goods-received-note.repository';

@Injectable()
export class GoodsReceivedNoteService {
  constructor(private readonly repository: GoodsReceivedNoteRepository) {}

  async list(
    params: ListGoodsReceivedNoteQueryDto,
  ): Promise<PaginatedResult<GoodsReceivedNote>> {
    const { rows, total } = await this.repository.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id: number): Promise<GoodsReceivedNote> {
    const receipt = await this.repository.findById(id);
    if (!receipt) {
      throw AppException.notFound(`Không tìm thấy phiếu nhập kho với id=${id}`);
    }
    return receipt;
  }

  async create(dto: CreateGoodsReceivedNoteDto): Promise<GoodsReceivedNote> {
    return this.repository.create(dto);
  }

  async update(id: number, dto: UpdateGoodsReceivedNoteDto): Promise<GoodsReceivedNote> {
    await this.getById(id);

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw AppException.notFound(`Không tìm thấy phiếu với id=${id}`);
    }

    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }
}

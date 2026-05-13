import { GoodsReceivedNoteRepository } from './goods-received-note.repository';
import {
  Receipt,
  CreateReceiptDto,
  UpdateReceiptDto,
  ListReceiptQuery,
} from './goods-received-note.types';
import { AppError } from '../../shared/utils/app-error';
import { PaginationMeta } from '../../shared/types';

export class GoodsReceivedNoteService {
  constructor(private readonly repo: GoodsReceivedNoteRepository) {}

  // ─── Danh sách phiếu nhập kho ────────────────────────────
  async list(params: ListReceiptQuery): Promise<{ data: Receipt[]; pagination: PaginationMeta }> {
    const { rows, total } = await this.repo.findAll(params);
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Chi tiết phiếu ─────────────────────────────────────
  async getById(id: number): Promise<Receipt> {
    const receipt = await this.repo.findById(id);
    if (!receipt) throw AppError.notFound(`Không tìm thấy phiếu nhập kho với id=${id}`);
    return receipt;
  }

  // ─── Tạo phiếu nhập kho mới ─────────────────────────────
  async create(dto: CreateReceiptDto): Promise<Receipt> {
    const receipt = await this.repo.create(dto);
    return receipt;
  }

  // ─── Cập nhật phiếu ─────────────────────────────────────
  async update(id: number, dto: UpdateReceiptDto): Promise<Receipt> {
    await this.getById(id);

    const updated = await this.repo.update(id, dto);
    if (!updated) throw AppError.notFound(`Không tìm thấy phiếu với id=${id}`);
    return updated;
  }

  // ─── Xoá phiếu ──────────────────────────────────────────
  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }
}

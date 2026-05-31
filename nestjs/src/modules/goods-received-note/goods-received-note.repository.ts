import { Injectable } from '@nestjs/common';
import { numberToWords } from '../../common/utils/number-to-words';
import { DatabaseService } from '../../database/database.service';
import {
  CreateGoodsReceivedNoteDto,
  ListGoodsReceivedNoteQueryDto,
  UpdateGoodsReceivedNoteDto,
} from './dto/goods-received-note.schema';
import {
  GoodsReceivedNote,
  GoodsReceivedNoteProduct,
} from './entities/goods-received-note.entity';

@Injectable()
export class GoodsReceivedNoteRepository {
  constructor(private readonly db: DatabaseService) {}

  async findAll(
    params: ListGoodsReceivedNoteQueryDto,
  ): Promise<{ rows: GoodsReceivedNote[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      warehouse_id: warehouseId,
      division_id: divisionId,
      date_from: dateFrom,
      date_to: dateTo,
      search,
    } = params;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (warehouseId) where.warehouse_id = warehouseId;
    if (divisionId) where.division_id = divisionId;
    if (dateFrom) where.receipt_date = { ...where.receipt_date, gte: dateFrom };
    if (dateTo) where.receipt_date = { ...where.receipt_date, lte: dateTo };
    if (search) where.deliverer_name = { contains: search, mode: 'insensitive' };

    const [total, rows] = await Promise.all([
      this.db.goodsReceivedNote.count({ where }),
      this.db.goodsReceivedNote.findMany({
        where,
        include: {
          warehouse: {
            select: { name: true },
          },
        },
        orderBy: [
          { receipt_date: 'desc' },
          { id: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
    ]);

    const receiptsWithWarehouseName = rows.map((row) => ({
      ...row,
      warehouse_name: row.warehouse?.name ?? null,
      debit_amount: Number(row.debit_amount),
      credit_amount: Number(row.credit_amount),
    }));

    return {
      rows: receiptsWithWarehouseName as GoodsReceivedNote[],
      total,
    };
  }

  async findById(id: number): Promise<GoodsReceivedNote | null> {
    const receipt = await this.db.goodsReceivedNote.findUnique({
      where: { id },
      include: {
        warehouse: {
          select: { name: true },
        },
        products: {
          include: {
            product: {
              select: { name: true, code: true },
            },
          },
        },
      },
    });

    if (!receipt) return null;

    const productsWithProductInfo = receipt.products.map((p) => ({
      ...p,
      product_name: p.product.name,
      product_code: p.product.code,
      qty_actual: Number(p.qty_actual),
      qty_document: Number(p.qty_document),
      unit_price: Number(p.unit_price),
      total_amount: Number(p.total_amount),
    }));

    return {
      ...receipt,
      warehouse_name: receipt.warehouse?.name ?? null,
      debit_amount: Number(receipt.debit_amount),
      credit_amount: Number(receipt.credit_amount),
      products: productsWithProductInfo as GoodsReceivedNoteProduct[],
    } as GoodsReceivedNote;
  }

  async create(dto: CreateGoodsReceivedNoteDto): Promise<GoodsReceivedNote> {
    return this.db.withTransaction(async () => {
      const receipt = await this.db.goodsReceivedNote.create({
        data: {
          receipt_date: new Date(dto.receipt_date),
          warehouse_id: dto.warehouse_id,
          division_id: dto.division_id,
          deliverer_name: dto.deliverer_name,
          preparer_name: dto.preparer_name,
          storekeeper_name: dto.storekeeper_name,
          chief_accountant_name: dto.chief_accountant_name,
          delivery_date: dto.delivery_date ? new Date(dto.delivery_date) : null,
          ref_doc_type: dto.ref_doc_type,
          ref_doc_number: dto.ref_doc_number,
          ref_doc_date: dto.ref_doc_date ? new Date(dto.ref_doc_date) : null,
          ref_doc_issuer: dto.ref_doc_issuer,
          debit_amount: dto.debit_amount ?? 0,
          credit_amount: dto.credit_amount ?? 0,
          source_documents: dto.source_documents,
        },
      });

      await this.insertProducts(receipt.id, dto.products);

      return (await this.findById(receipt.id))!;
    });
  }

  async update(id: number, dto: UpdateGoodsReceivedNoteDto): Promise<GoodsReceivedNote | null> {
    return this.db.withTransaction(async () => {
      const oldReceipt = await this.findById(id);
      if (!oldReceipt) return null;

      const data: any = {};
      if (dto.receipt_date !== undefined) data.receipt_date = dto.receipt_date;
      if (dto.deliverer_name !== undefined) data.deliverer_name = dto.deliverer_name;
      if (dto.preparer_name !== undefined) data.preparer_name = dto.preparer_name;
      if (dto.storekeeper_name !== undefined) data.storekeeper_name = dto.storekeeper_name;
      if (dto.chief_accountant_name !== undefined) data.chief_accountant_name = dto.chief_accountant_name;
      if (dto.delivery_date !== undefined) data.delivery_date = dto.delivery_date;
      if (dto.warehouse_id !== undefined) data.warehouse_id = dto.warehouse_id;
      if (dto.division_id !== undefined) data.division_id = dto.division_id;
      if (dto.ref_doc_type !== undefined) data.ref_doc_type = dto.ref_doc_type;
      if (dto.ref_doc_number !== undefined) data.ref_doc_number = dto.ref_doc_number;
      if (dto.ref_doc_date !== undefined) data.ref_doc_date = dto.ref_doc_date;
      if (dto.ref_doc_issuer !== undefined) data.ref_doc_issuer = dto.ref_doc_issuer;
      if (dto.debit_amount !== undefined) data.debit_amount = dto.debit_amount;
      if (dto.credit_amount !== undefined) data.credit_amount = dto.credit_amount;
      if (dto.source_documents !== undefined) data.source_documents = dto.source_documents;

      if (Object.keys(data).length > 0) {
        await this.db.goodsReceivedNote.update({
          where: { id },
          data,
        });
      }

      if (dto.products) {
        if (oldReceipt.products) {
          for (const product of oldReceipt.products) {
            await this.db.productStockSummary.update({
              where: { product_id: product.product_id },
              data: {
                total_actual_qty: { decrement: product.qty_actual },
                total_document_qty: { decrement: product.qty_document },
              },
            });
          }
        }

        await this.db.goodsReceivedNoteProduct.deleteMany({
          where: { grn_id: id },
        });

        await this.insertProducts(id, dto.products);
      }

      return this.findById(id);
    });
  }

  async delete(id: number): Promise<boolean> {
    return this.db.withTransaction(async () => {
      const receipt = await this.findById(id);
      if (!receipt) return false;

      if (receipt.products) {
        for (const product of receipt.products) {
          await this.db.productStockSummary.update({
            where: { product_id: product.product_id },
            data: {
              total_actual_qty: { decrement: product.qty_actual },
              total_document_qty: { decrement: product.qty_document },
            },
          });
        }
      }

      await this.db.goodsReceivedNote.delete({ where: { id } });
      return true;
    });
  }

  private async insertProducts(
    grnId: number,
    products: CreateGoodsReceivedNoteDto['products'],
  ): Promise<void> {
    for (const product of products) {
      const totalAmount = product.qty_actual * product.unit_price;
      const totalAmountInWords = numberToWords(totalAmount);

      await this.db.goodsReceivedNoteProduct.create({
        data: {
          grn_id: grnId,
          product_id: product.product_id,
          qty_actual: product.qty_actual,
          qty_document: product.qty_document,
          unit_price: product.unit_price,
          total_amount: totalAmount,
          total_amount_in_words: totalAmountInWords,
        },
      });

      await this.db.productStockSummary.upsert({
        where: { product_id: product.product_id },
        create: {
          product_id: product.product_id,
          total_actual_qty: product.qty_actual,
          total_document_qty: product.qty_document,
        },
        update: {
          total_actual_qty: { increment: product.qty_actual },
          total_document_qty: { increment: product.qty_document },
        },
      });
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
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
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (warehouseId) { conditions.push(`wr.warehouse_id = $${idx++}`); values.push(warehouseId); }
    if (divisionId) { conditions.push(`wr.division_id = $${idx++}`); values.push(divisionId); }
    if (dateFrom) { conditions.push(`wr.receipt_date >= $${idx++}`); values.push(dateFrom); }
    if (dateTo) { conditions.push(`wr.receipt_date <= $${idx++}`); values.push(dateTo); }
    if (search) {
      conditions.push(`(wr.deliverer_name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM goods_received_notes wr ${where}`,
      values,
    );

    const dataResult = await this.db.query<GoodsReceivedNote>(
      `SELECT wr.*, w.name AS warehouse_name
       FROM goods_received_notes wr
       LEFT JOIN warehouses w ON w.id = wr.warehouse_id
       ${where}
       ORDER BY wr.receipt_date DESC, wr.id DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset],
    );

    return {
      rows: dataResult.rows,
      total: parseInt(countResult.rows[0].total, 10),
    };
  }

  async findById(id: number): Promise<GoodsReceivedNote | null> {
    const receiptResult = await this.db.query<GoodsReceivedNote>(
      `SELECT wr.*, w.name AS warehouse_name
       FROM goods_received_notes wr
       LEFT JOIN warehouses w ON w.id = wr.warehouse_id
       WHERE wr.id = $1`,
      [id],
    );

    if (receiptResult.rows.length === 0) {
      return null;
    }

    const receipt = receiptResult.rows[0];
    const productsResult = await this.db.query<GoodsReceivedNoteProduct>(
      `SELECT grp.*, p.name as product_name, p.code as product_code
       FROM goods_received_note_products grp
       JOIN products p ON grp.product_id = p.id
       WHERE grp.grn_id = $1`,
      [id],
    );

    receipt.products = productsResult.rows;
    return receipt;
  }

  async create(dto: CreateGoodsReceivedNoteDto): Promise<GoodsReceivedNote> {
    return this.db.withTransaction(async (client: PoolClient) => {
      const headerResult = await client.query<GoodsReceivedNote>(
        `INSERT INTO goods_received_notes (
           receipt_date, warehouse_id, division_id,
           deliverer_name, preparer_name, storekeeper_name, chief_accountant_name, delivery_date,
           ref_doc_type, ref_doc_number, ref_doc_date, ref_doc_issuer,
           debit_amount, credit_amount, source_documents
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
         RETURNING *`,
        [
          dto.receipt_date,
          dto.warehouse_id,
          dto.division_id ?? null,
          dto.deliverer_name ?? null,
          dto.preparer_name ?? null,
          dto.storekeeper_name ?? null,
          dto.chief_accountant_name ?? null,
          dto.delivery_date ?? null,
          dto.ref_doc_type ?? null,
          dto.ref_doc_number ?? null,
          dto.ref_doc_date ?? null,
          dto.ref_doc_issuer ?? null,
          dto.debit_amount ?? 0,
          dto.credit_amount ?? 0,
          dto.source_documents ?? null,
        ],
      );

      const receipt = headerResult.rows[0];
      await this.insertProducts(client, receipt.id, dto.products);

      return (await this.findById(receipt.id))!;
    });
  }

  async update(id: number, dto: UpdateGoodsReceivedNoteDto): Promise<GoodsReceivedNote | null> {
    return this.db.withTransaction(async (client: PoolClient) => {
      const oldReceipt = await this.findById(id);
      if (!oldReceipt) {
        return null;
      }

      const fields: string[] = [];
      const values: unknown[] = [];
      let idx = 1;

      if (dto.receipt_date !== undefined) { fields.push(`receipt_date = $${idx++}`); values.push(dto.receipt_date); }
      if (dto.deliverer_name !== undefined) { fields.push(`deliverer_name = $${idx++}`); values.push(dto.deliverer_name); }
      if (dto.preparer_name !== undefined) { fields.push(`preparer_name = $${idx++}`); values.push(dto.preparer_name); }
      if (dto.storekeeper_name !== undefined) { fields.push(`storekeeper_name = $${idx++}`); values.push(dto.storekeeper_name); }
      if (dto.chief_accountant_name !== undefined) { fields.push(`chief_accountant_name = $${idx++}`); values.push(dto.chief_accountant_name); }
      if (dto.delivery_date !== undefined) { fields.push(`delivery_date = $${idx++}`); values.push(dto.delivery_date); }
      if (dto.warehouse_id !== undefined) { fields.push(`warehouse_id = $${idx++}`); values.push(dto.warehouse_id); }
      if (dto.division_id !== undefined) { fields.push(`division_id = $${idx++}`); values.push(dto.division_id); }
      if (dto.ref_doc_type !== undefined) { fields.push(`ref_doc_type = $${idx++}`); values.push(dto.ref_doc_type); }
      if (dto.ref_doc_number !== undefined) { fields.push(`ref_doc_number = $${idx++}`); values.push(dto.ref_doc_number); }
      if (dto.ref_doc_date !== undefined) { fields.push(`ref_doc_date = $${idx++}`); values.push(dto.ref_doc_date); }
      if (dto.ref_doc_issuer !== undefined) { fields.push(`ref_doc_issuer = $${idx++}`); values.push(dto.ref_doc_issuer); }
      if (dto.debit_amount !== undefined) { fields.push(`debit_amount = $${idx++}`); values.push(dto.debit_amount); }
      if (dto.credit_amount !== undefined) { fields.push(`credit_amount = $${idx++}`); values.push(dto.credit_amount); }
      if (dto.source_documents !== undefined) { fields.push(`source_documents = $${idx++}`); values.push(dto.source_documents); }

      if (fields.length > 0) {
        values.push(id);
        await client.query(
          `UPDATE goods_received_notes SET ${fields.join(', ')} WHERE id = $${idx}`,
          values,
        );
      }

      if (dto.products) {
        if (oldReceipt.products) {
          for (const product of oldReceipt.products) {
            await client.query(
              `UPDATE product_stock_summaries
               SET total_actual_qty = total_actual_qty - $1,
                   total_document_qty = total_document_qty - $2
               WHERE product_id = $3`,
              [product.qty_actual, product.qty_document, product.product_id],
            );
          }
        }

        await client.query('DELETE FROM goods_received_note_products WHERE grn_id = $1', [id]);
        await this.insertProducts(client, id, dto.products);
      }

      return this.findById(id);
    });
  }

  async delete(id: number): Promise<boolean> {
    return this.db.withTransaction(async (client: PoolClient) => {
      const receipt = await this.findById(id);
      if (!receipt) {
        return false;
      }

      if (receipt.products) {
        for (const product of receipt.products) {
          await client.query(
            `UPDATE product_stock_summaries
             SET total_actual_qty = total_actual_qty - $1,
                 total_document_qty = total_document_qty - $2
             WHERE product_id = $3`,
            [product.qty_actual, product.qty_document, product.product_id],
          );
        }
      }

      const result = await client.query('DELETE FROM goods_received_notes WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    });
  }

  private async insertProducts(
    client: PoolClient,
    grnId: number,
    products: CreateGoodsReceivedNoteDto['products'],
  ): Promise<void> {
    for (const product of products) {
      const totalAmount = product.qty_actual * product.unit_price;
      const totalAmountInWords = numberToWords(totalAmount);

      await client.query(
        `INSERT INTO goods_received_note_products (
           grn_id, product_id, qty_actual, qty_document, unit_price, total_amount, total_amount_in_words
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          grnId,
          product.product_id,
          product.qty_actual,
          product.qty_document,
          product.unit_price,
          totalAmount,
          totalAmountInWords,
        ],
      );

      await client.query(
        `INSERT INTO product_stock_summaries (product_id, total_actual_qty, total_document_qty)
         VALUES ($1, $2, $3)
         ON CONFLICT (product_id) DO UPDATE
         SET total_actual_qty = product_stock_summaries.total_actual_qty + EXCLUDED.total_actual_qty,
             total_document_qty = product_stock_summaries.total_document_qty + EXCLUDED.total_document_qty`,
        [product.product_id, product.qty_actual, product.qty_document],
      );
    }
  }
}

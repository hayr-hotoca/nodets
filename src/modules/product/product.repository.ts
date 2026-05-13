import { query, withTransaction } from '../../db/pool';
import { Product, CreateProductDto, UpdateProductDto, ListProductQuery } from './product.types';

export class ProductRepository {

  async findAll(params: ListProductQuery): Promise<{ rows: Product[]; total: number }> {
    const { page = 1, limit = 20, search } = params;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(p.code ILIKE $${idx} OR p.name ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM products p ${where}`, values
    );

    const dataResult = await query<Product>(
      `SELECT p.*, s.total_actual_qty, s.total_document_qty
       FROM products p
       LEFT JOIN product_stock_summaries s ON s.product_id = p.id
       ${where}
       ORDER BY p.code
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, limit, offset]
    );

    return { rows: dataResult.rows, total: parseInt(countResult.rows[0].total, 10) };
  }

  async findById(id: number): Promise<Product | null> {
    const result = await query<Product>(
      `SELECT p.*, s.total_actual_qty, s.total_document_qty
       FROM products p
       LEFT JOIN product_stock_summaries s ON s.product_id = p.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  }

  async findByCode(code: string): Promise<Product | null> {
    const result = await query<Product>('SELECT * FROM products WHERE code = $1', [code]);
    return result.rows[0] ?? null;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return withTransaction(async (client) => {
      const result = await client.query<Product>(
        `INSERT INTO products (code, name, description, calculation_unit)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [dto.code, dto.name, dto.description ?? null, dto.calculation_unit ?? null]
      );
      const product = result.rows[0];

      // Initialize summary
      await client.query(
        `INSERT INTO product_stock_summaries (product_id) VALUES ($1)`,
        [product.id]
      );

      return product;
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.code !== undefined)             { fields.push(`code = $${idx++}`);             values.push(dto.code); }
    if (dto.name !== undefined)             { fields.push(`name = $${idx++}`);             values.push(dto.name); }
    if (dto.description !== undefined)      { fields.push(`description = $${idx++}`);      values.push(dto.description); }
    if (dto.calculation_unit !== undefined) { fields.push(`calculation_unit = $${idx++}`); values.push(dto.calculation_unit); }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query<Product>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async updateSummary(productId: number, actualDelta: number, documentDelta: number, client?: import('pg').PoolClient): Promise<void> {
    const q = client ? client.query.bind(client) : query;
    await q(
      `INSERT INTO product_stock_summaries (product_id, total_actual_qty, total_document_qty)
       VALUES ($1, $2, $3)
       ON CONFLICT (product_id) DO UPDATE
       SET total_actual_qty = product_stock_summaries.total_actual_qty + EXCLUDED.total_actual_qty,
           total_document_qty = product_stock_summaries.total_document_qty + EXCLUDED.total_document_qty`,
      [productId, actualDelta, documentDelta]
    );
  }
}

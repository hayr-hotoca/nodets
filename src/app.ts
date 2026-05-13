import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { errorMiddleware, notFoundMiddleware } from './shared/middlewares/error.middleware';
import warehouseRouter from './modules/warehouse/warehouse.router';
import unitRouter      from './modules/unit/unit.router';
import divisionRouter  from './modules/division/division.router';
import productRouter   from './modules/product/product.router';

import goodsReceivedNoteRouter from './modules/goods-received-note/goods-received-note.router';

export function createApp(): Application {
  const app = express();

  // ─── Global Middlewares ────────────────────────────────
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '../public')));

  // ─── Health Check ──────────────────────────────────────
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Inventory Management API',
      },
    });
  });

  // ─── Routes ────────────────────────────────────────────
  app.use('/api/warehouses',         warehouseRouter);
  app.use('/api/units',              unitRouter);
  app.use('/api/divisions',          divisionRouter);
  app.use('/api/products',           productRouter);

  app.use('/api/goods-received-notes', goodsReceivedNoteRouter);

  // ─── 404 ───────────────────────────────────────────────
  app.use(notFoundMiddleware);

  // ─── Global Error Handler ──────────────────────────────
  app.use(errorMiddleware);

  return app;
}

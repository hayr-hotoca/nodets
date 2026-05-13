import * as dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { appConfig } from './config/app.config';
import { pool } from './db/pool';

async function bootstrap(): Promise<void> {
  // Verify DB connection
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('[DB] PostgreSQL connected successfully');
  } catch (err) {
    console.error('[DB] Failed to connect to PostgreSQL:', err);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(appConfig.port, () => {
    console.log(`\n🚀 Inventory Management API`);
    console.log(`   Environment : ${appConfig.nodeEnv}`);
    console.log(`   Port        : ${appConfig.port}`);
    console.log(`   Database    : ${appConfig.db.host}:${appConfig.db.port}/${appConfig.db.database}`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   GET  /api/health`);
    console.log(`   ---  Goods Received Notes (Phiếu nhập kho)  ---`);
    console.log(`   GET  /api/goods-received-notes`);
    console.log(`   POST /api/goods-received-notes`);
    console.log(`   GET  /api/goods-received-notes/:id`);
    console.log(`   PUT  /api/goods-received-notes/:id`);
    console.log(`   DELETE /api/goods-received-notes/:id`);
    console.log(`   ---  Danh mục  ---`);
    console.log(`   GET  /api/warehouses`);
    console.log(`   GET  /api/units`);
    console.log(`   GET  /api/divisions`);
    console.log(`   GET  /api/products\n`);
  });

  // Graceful shutdown
  const shutdown = (): void => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(async () => {
      await pool.end();
      console.log('[Server] Closed. Bye!');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap();

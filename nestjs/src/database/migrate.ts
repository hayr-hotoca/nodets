import * as fs from 'fs';
import * as path from 'path';
import { Pool } from 'pg';
import configuration from '../config/configuration';

async function migrate(): Promise<void> {
  const config = configuration();
  const pool = new Pool(config.db);
  const migrationDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationDir).filter((file) => file.endsWith('.sql')).sort();

  console.log('[Migrate] Running migrations...');

  for (const file of files) {
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    console.log(`[Migrate] Executing: ${file}`);
    await pool.query(sql);
    console.log(`[Migrate] Done: ${file}`);
  }

  console.log('[Migrate] All migrations completed.');
  await pool.end();
}

migrate().catch((error) => {
  console.error('[Migrate] Error:', error);
  process.exit(1);
});

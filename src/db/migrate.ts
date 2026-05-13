import * as fs from 'fs';
import * as path from 'path';
import { pool } from './pool';

async function migrate(): Promise<void> {
  const migrationDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationDir).filter((f) => f.endsWith('.sql')).sort();

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

migrate().catch((err) => {
  console.error('[Migrate] Error:', err);
  process.exit(1);
});

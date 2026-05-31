import { Global, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Global()
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('PostgreSQL connected successfully via Prisma with adapter');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL via Prisma', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('PostgreSQL connection closed via Prisma');
  }

  async withTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.$transaction(callback);
  }
}

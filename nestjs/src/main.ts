import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { DatabaseService } from './database/database.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const databaseService = app.get(DatabaseService);
  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('port', 3001);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(configService));

  // Static file serving
  app.useStaticAssets(join(__dirname, '..', '..', 'public'), {
    prefix: '/public/',
  });
  
  await databaseService.onModuleInit();

  const server = await app.listen(port);

  logger.log('Inventory Management API (NestJS)');
  logger.log(`Environment : ${configService.get<string>('nodeEnv')}`);
  logger.log(`Port        : ${port}`);
  logger.log(`Database    : ${configService.get<string>('db.host')}:${configService.get<number>('db.port')}/${configService.get<string>('db.database')}`);
  logger.log('Available endpoints:');
  logger.log('  GET  /api/health');
  logger.log('  ---  Goods Received Notes ---');
  logger.log('  GET  /api/goods-received-notes');
  logger.log('  POST /api/goods-received-notes');
  logger.log('  GET  /api/goods-received-notes/:id');
  logger.log('  PUT  /api/goods-received-notes/:id');
  logger.log('  DELETE /api/goods-received-notes/:id');
  logger.log('  ---  Danh mục ---');
  logger.log('  GET  /api/warehouses');
  logger.log('  GET  /api/units');
  logger.log('  GET  /api/divisions');
  logger.log('  GET  /api/products');

  // Graceful shutdown
  const shutdown = async (): Promise<void> => {
    logger.log('[Server] Shutting down gracefully...');
    server.close(async () => {
      await databaseService.onModuleDestroy();
      logger.log('[Server] Closed. Bye!');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap();

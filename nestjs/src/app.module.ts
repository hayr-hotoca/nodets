import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { DivisionModule } from './modules/division/division.module';
import { GoodsReceivedNoteModule } from './modules/goods-received-note/goods-received-note.module';
import { ProductModule } from './modules/product/product.module';
import { UnitModule } from './modules/unit/unit.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    HealthModule,
    WarehouseModule,
    UnitModule,
    DivisionModule,
    ProductModule,
    GoodsReceivedNoteModule,
  ],
})
export class AppModule {}

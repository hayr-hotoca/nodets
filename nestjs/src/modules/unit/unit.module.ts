import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitRepository } from './unit.repository';
import { UnitService } from './unit.service';

@Module({
  controllers: [UnitController],
  providers: [UnitService, UnitRepository],
})
export class UnitModule {}

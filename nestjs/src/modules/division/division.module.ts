import { Module } from '@nestjs/common';
import { DivisionController } from './division.controller';
import { DivisionRepository } from './division.repository';
import { DivisionService } from './division.service';

@Module({
  controllers: [DivisionController],
  providers: [DivisionService, DivisionRepository],
})
export class DivisionModule {}

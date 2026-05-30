import { Module } from '@nestjs/common';
import { GoodsReceivedNoteController } from './goods-received-note.controller';
import { GoodsReceivedNoteRepository } from './goods-received-note.repository';
import { GoodsReceivedNoteService } from './goods-received-note.service';

@Module({
  controllers: [GoodsReceivedNoteController],
  providers: [GoodsReceivedNoteService, GoodsReceivedNoteRepository],
})
export class GoodsReceivedNoteModule {}

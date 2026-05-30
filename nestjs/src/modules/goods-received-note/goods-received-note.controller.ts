import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateGoodsReceivedNoteSchema,
  ListGoodsReceivedNoteQuerySchema,
  UpdateGoodsReceivedNoteSchema,
  CreateGoodsReceivedNoteDto,
  ListGoodsReceivedNoteQueryDto,
  UpdateGoodsReceivedNoteDto,
} from './dto/goods-received-note.schema';
import { GoodsReceivedNoteService } from './goods-received-note.service';

@Controller('goods-received-notes')
export class GoodsReceivedNoteController {
  constructor(private readonly service: GoodsReceivedNoteService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(ListGoodsReceivedNoteQuerySchema)) query: ListGoodsReceivedNoteQueryDto,
  ) {
    return this.service.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateGoodsReceivedNoteSchema)) dto: CreateGoodsReceivedNoteDto,
  ) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateGoodsReceivedNoteSchema)) dto: UpdateGoodsReceivedNoteDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}

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
  CreateUnitSchema,
  ListUnitQuerySchema,
  UpdateUnitSchema,
  CreateUnitDto,
  ListUnitQueryDto,
  UpdateUnitDto,
} from './dto/unit.schema';
import { UnitService } from './unit.service';

@Controller('units')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Get()
  list(@Query(new ZodValidationPipe(ListUnitQuerySchema)) query: ListUnitQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateUnitSchema)) dto: CreateUnitDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateUnitSchema)) dto: UpdateUnitDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}

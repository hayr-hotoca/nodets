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
  CreateWarehouseSchema,
  ListWarehouseQuerySchema,
  UpdateWarehouseSchema,
  CreateWarehouseDto,
  ListWarehouseQueryDto,
  UpdateWarehouseDto,
} from './dto/warehouse.schema';
import { WarehouseService } from './warehouse.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  list(@Query(new ZodValidationPipe(ListWarehouseQuerySchema)) query: ListWarehouseQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateWarehouseSchema)) dto: CreateWarehouseDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateWarehouseSchema)) dto: UpdateWarehouseDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}

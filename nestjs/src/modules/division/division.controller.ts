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
  CreateDivisionSchema,
  ListDivisionQuerySchema,
  UpdateDivisionSchema,
  CreateDivisionDto,
  ListDivisionQueryDto,
  UpdateDivisionDto,
} from './dto/division.schema';
import { DivisionService } from './division.service';

@Controller('divisions')
export class DivisionController {
  constructor(private readonly service: DivisionService) {}

  @Get()
  list(@Query(new ZodValidationPipe(ListDivisionQuerySchema)) query: ListDivisionQueryDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateDivisionSchema)) dto: CreateDivisionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateDivisionSchema)) dto: UpdateDivisionDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}

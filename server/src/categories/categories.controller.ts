import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CategoriesService,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from './categories.service';
import type { Category } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
    return { ok: true };
  }
}

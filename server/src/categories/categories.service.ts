// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Category } from '@prisma/client';

export type CreateCategoryDto = {
  name: string;
  description: string;
  imageUrl: string;
};

export type UpdateCategoryDto = Partial<{
  name: string;
  description: string;
  imageUrl: string;
}>;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    // პირველ რიგში დავრწმუნდეთ, რომ ისეთი კატეგორია არსებობს
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name ?? undefined,
        description: dto.description ?? undefined,
        imageUrl: dto.imageUrl ?? undefined,
      },
    });
  }

  async remove(id: number): Promise<void> {
    // თუ არ არსებობს, findOne ჩაგვიგდებს NotFound-ს
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });
  }
}

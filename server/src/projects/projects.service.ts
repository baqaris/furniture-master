// src/projects/projects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Project as PrismaProject } from '@prisma/client';

export interface Project {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  gallery: string[];
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export type FindProjectsFilter = {
  title?: string;
  categoryId?: number;
  onlyPublished?: boolean;
};

export type CreateProjectDto = {
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  gallery?: string[];
  videoUrl?: string;
  isPublished?: boolean;
};

export type UpdateProjectDto = Partial<{
  title: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  gallery: string[];
  videoUrl: string;
  isPublished: boolean;
}>;

// helper – PrismaProject → Project (galleryJson → gallery[])
function mapProject(entity: PrismaProject): Project {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    categoryId: entity.categoryId,
    imageUrl: entity.imageUrl,
    gallery: entity.galleryJson
      ? (JSON.parse(entity.galleryJson) as string[])
      : [entity.imageUrl],
    videoUrl: entity.videoUrl ?? undefined,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    isPublished: entity.isPublished,
  };
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter?: FindProjectsFilter): Promise<Project[]> {
    const where: any = {};

    if (filter?.categoryId != null) {
      where.categoryId = filter.categoryId;
    }

    if (filter?.onlyPublished) {
      where.isPublished = true;
    }

    if (filter?.title) {
      const q = filter.title.toLowerCase().trim();
      if (q.length > 0) {
        where.OR = [
          {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ];
      }
    }

    const rows = await this.prisma.project.findMany({
      where,
      orderBy: { id: 'desc' },
    });

    return rows.map(mapProject);
  }

  async findOne(id: number): Promise<Project> {
    const entity = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Project not found');
    }

    return mapProject(entity);
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const galleryArray =
      dto.gallery && dto.gallery.length > 0 ? dto.gallery : [dto.imageUrl];

    const entity = await this.prisma.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
        galleryJson: JSON.stringify(galleryArray),
        videoUrl: dto.videoUrl ?? null,
        isPublished: dto.isPublished ?? true,
      },
    });

    return mapProject(entity);
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    // თუ არ არსებობს, error
    await this.findOne(id);

    const data: any = {
      title: dto.title ?? undefined,
      description: dto.description ?? undefined,
      categoryId: dto.categoryId ?? undefined,
      imageUrl: dto.imageUrl ?? undefined,
      videoUrl: dto.videoUrl ?? undefined,
      isPublished: dto.isPublished ?? undefined,
    };

    if (dto.gallery) {
      data.galleryJson = JSON.stringify(dto.gallery);
    }

    const entity = await this.prisma.project.update({
      where: { id },
      data,
    });

    return mapProject(entity);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.prisma.project.delete({
      where: { id },
    });
  }
}

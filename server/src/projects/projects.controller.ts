import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ProjectsService,
  type Project,
  type FindProjectsFilter,
  type CreateProjectDto,
  type UpdateProjectDto,
} from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(
    @Query('title') title?: string,
    @Query('categoryId') categoryIdRaw?: string,
    @Query('onlyPublished') onlyPublishedRaw?: string,
  ): Promise<Project[]> {
    const filter: FindProjectsFilter = {
      title,
      categoryId:
        categoryIdRaw != null && categoryIdRaw !== ''
          ? Number(categoryIdRaw)
          : undefined,
      onlyPublished:
        typeof onlyPublishedRaw === 'string'
          ? onlyPublishedRaw === 'true'
          : undefined,
    };

    return this.projectsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateProjectDto): Promise<Project> {
    return this.projectsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);
    return { ok: true };
  }
}

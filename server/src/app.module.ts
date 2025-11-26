import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';

import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    PrismaModule,
    ContactModule, 
  ],

  controllers: [
    AppController,
    ProjectsController,
    CategoriesController,
    AuthController,
    
  ],

  providers: [
    AppService,
    ProjectsService,
    CategoriesService,
    AuthService,
    
  ],
})
export class AppModule {}

// src/contact/contact.controller.ts
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
  ContactService,
  type CreateContactDto,
  type FindContactFilter,
} from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() body: CreateContactDto) {
    const msg = await this.contactService.create(body);
    return {
      ok: true,
      message: 'Contact message received',
      id: msg.id,
    };
  }

  @Get()
  findAll(@Query('isRead') isReadRaw?: string) {
    const filter: FindContactFilter = {};

    if (isReadRaw === 'true') filter.isRead = true;
    if (isReadRaw === 'false') filter.isRead = false;

    return this.contactService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    const msg = await this.contactService.markAsRead(id);
    return { ok: true, message: 'Marked as read', id: msg.id };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactService.remove(id);
    return { ok: true };
  }
}

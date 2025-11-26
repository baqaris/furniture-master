// src/contact/contact.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ContactMessage } from '@prisma/client';

export class CreateContactDto {
  name: string;
  phone: string;
  email?: string;
  projectType?: string;
  message: string;
  preferPhone?: boolean;
  preferEmail?: boolean;
}

export type FindContactFilter = {
  isRead?: boolean;
};

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter?: FindContactFilter): Promise<ContactMessage[]> {
    return this.prisma.contactMessage.findMany({
      where: {
        isRead:
          typeof filter?.isRead === 'boolean' ? filter.isRead : undefined,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<ContactMessage> {
    const msg = await this.prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!msg) {
      throw new NotFoundException('Contact message not found');
    }

    return msg;
  }

  async create(dto: CreateContactDto): Promise<ContactMessage> {
    const msg = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        projectType: dto.projectType,
        message: dto.message,
        preferPhone: dto.preferPhone ?? false,
        preferEmail: dto.preferEmail ?? false,
        // createdAt და isRead მოდელში default-ებია
      },
    });

    console.log('📩 New contact message:', msg);
    return msg;
  }

  async markAsRead(id: number): Promise<ContactMessage> {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.contactMessage.delete({
      where: { id },
    });
  }
}

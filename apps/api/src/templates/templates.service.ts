import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTemplateDto: CreateTemplateDto) {
    return this.prisma.notificationTemplate.create({
      data: createTemplateDto,
    });
  }

  findAll() {
    return this.prisma.notificationTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    await this.findOne(id);

    return this.prisma.notificationTemplate.update({
      where: { id },
      data: updateTemplateDto,
    });
  }

  async delete(id: number) {
    const template = await this.findOne(id);

    await this.prisma.notificationTemplate.delete({
      where: { id },
    });

    return template;
  }
}
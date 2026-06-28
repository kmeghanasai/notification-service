import { notificationQueue } from '../queues/notification.queue';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: CreateNotificationDto) {
    const createdNotification = await this.prisma.notification.create({
        data: notification,
    });

const delay =
  notification.scheduledAt
    ? new Date(notification.scheduledAt).getTime() - Date.now()
    : 0;

    await notificationQueue.add(
      'send-notification',
      {
        notificationId: createdNotification.id,
      },
      {
        delay: Math.max(delay, 0),
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return createdNotification;
  }

  findAll() {
    return this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async delete(id: number) {
    const notification = await this.findOne(id);

    await this.prisma.notification.delete({
      where: { id },
    });

    return notification;
  }

  async update(id: number, updateData: UpdateNotificationDto) {
    await this.findOne(id);

    return this.prisma.notification.update({
        where: { id },
        data: updateData,
    });
  }
}
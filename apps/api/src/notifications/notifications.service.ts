import { Injectable, NotFoundException } from '@nestjs/common';

type Notification = {
  id: number;
  recipient: string;
  channel: string;
  message: string;
  status: string;
  createdAt: Date;
};

@Injectable()
export class NotificationsService {
  private notifications: Notification[] = [];

  create(notification: Omit<Notification, 'id' | 'status' | 'createdAt'>) {
    const newNotification: Notification = {
      id: Date.now(),
      status: 'PENDING',
      createdAt: new Date(),
      ...notification,
    };

    this.notifications.push(newNotification);
    return newNotification;
  }

  findAll() {
    return this.notifications;
  }

  findOne(id: number) {
    const notification = this.notifications.find(
      n => n.id === id,
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  delete(id: number) {
    const index = this.notifications.findIndex(
      notification => notification.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Notification not found');
    }

    const deletedNotification = this.notifications.splice(index, 1);

    return deletedNotification[0];
  }
}
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
    private notifications : Notification[] = [];

    create(notification:any) {
        const newNotification = {
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
}

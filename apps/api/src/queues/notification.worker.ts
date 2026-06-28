import 'dotenv/config';
import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Resend } from 'resend';

const redisUrl = new URL(process.env.REDIS_URL!);

const prismaAdapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter: prismaAdapter,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const notificationWorker = new Worker(
  'notifications',
  async job => {
    console.log('Processing notification job:', job.data);

    const notificationId = job.data.notificationId;

    const notification = await prisma.notification.findUnique({
        where: {
            id: notificationId,
        },
    });

    if (!notification) {
        throw new Error('Notification not found');
    }

    try {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: notification.recipient,
        subject: 'Notification Service Test',
        text: notification.message,
    });

    await prisma.notification.update({
        where: { id: notificationId },
        data: {
        status: 'DELIVERED',
        },
    });

    console.log(`Notification ${notificationId} delivered.`);
    } catch (error) {
      console.error(error);

      const isFinalAttempt =
        job.attemptsMade + 1 >= (job.opts.attempts ?? 1);

      if (isFinalAttempt) {
        await prisma.notification.update({
          where: { id: notificationId },
          data: {
            status: 'FAILED',
          },
        });
      }

      throw error;
    }
  },
  {
    connection: {
      host: redisUrl.hostname,
      port: Number(redisUrl.port),
      username: redisUrl.username,
      password: redisUrl.password,
      tls: {},
    },
  },
);
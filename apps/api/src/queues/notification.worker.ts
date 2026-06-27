import 'dotenv/config';
import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const redisUrl = new URL(process.env.REDIS_URL!);

const prismaAdapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter: prismaAdapter,
});

export const notificationWorker = new Worker(
  'notifications',
  async job => {
    console.log('Processing notification job:', job.data);

    const notificationId = job.data.notificationId;

    await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        status: 'DELIVERED',
      },
    });

    console.log(`Notification ${notificationId} marked as DELIVERED`);

    return {
      success: true,
      notificationId,
    };
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
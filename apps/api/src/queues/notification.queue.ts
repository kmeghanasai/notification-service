import { Queue } from 'bullmq';

const redisUrl = new URL(process.env.REDIS_URL!);

export const notificationQueue = new Queue('notifications', {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port),
    username: redisUrl.username,
    password: redisUrl.password,
    tls: {},
  },
});
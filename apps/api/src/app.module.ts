import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [NotificationsModule, TemplatesModule],
  controllers: [AppController],
  providers: [AppService],
})

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
  ],
})
export class AppModule {}

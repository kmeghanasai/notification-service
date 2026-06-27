import { Body, Controller, Delete, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(
  @Param(
    'id',
    ParseIntPipe
  )
  id:number
  ) {
  return this.notificationsService
    .findOne(id);
  }
  
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.delete(id);
  }
}
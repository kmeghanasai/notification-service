import { IsEmail, IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {

 @IsEmail()
 recipient: string;

 @IsString()
 @IsIn(['EMAIL','SMS'])
 channel: string;

 @IsString()
 message: string;

 @IsOptional()
 @IsISO8601()
 scheduledAt?: string;
}

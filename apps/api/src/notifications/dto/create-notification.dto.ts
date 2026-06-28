import { IsEmail, IsIn, IsISO8601, IsInt, IsOptional, IsString } from 'class-validator';

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

 @IsOptional()
 @IsInt()
 templateId?: number;
}

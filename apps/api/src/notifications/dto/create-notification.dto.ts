import {
 IsEmail,
 IsString,
 IsIn
} from 'class-validator';

export class CreateNotificationDto {

 @IsEmail()
 recipient: string;

 @IsString()
 @IsIn(['EMAIL','SMS'])
 channel: string;

 @IsString()
 message: string;

}
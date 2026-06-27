import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsEmail()
  recipient?: string;

  @IsOptional()
  @IsIn(['EMAIL', 'SMS'])
  channel?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsIn(['PENDING', 'DELIVERED', 'FAILED'])
  status?: string;
}
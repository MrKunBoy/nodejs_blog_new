import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for Notification
export class CreateNotificationDto {
    @IsMongoId()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    message: string;
  
    @IsBoolean()
    @IsOptional()
    is_read?: boolean;
  }

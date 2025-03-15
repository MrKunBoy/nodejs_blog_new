import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

// DTO for updating Notification
export class UpdateNotificationDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  
    @IsOptional()
    @IsBoolean()
    is_read?: boolean;
  }
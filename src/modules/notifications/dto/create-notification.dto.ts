import { User } from "@/modules/users/schemas/user.schema";
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for Notification
export class CreateNotificationDto {
    user?: User[];
  
    @IsString()
    @IsNotEmpty()
    message: string;
  
    @IsBoolean()
    @IsOptional()
    is_read?: boolean;
  }

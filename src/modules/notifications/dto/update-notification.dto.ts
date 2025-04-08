import { PartialType } from "@nestjs/swagger";
import { CreateNotificationDto } from "./create-notification.dto";

// DTO for updating Notification
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
import { PartialType } from "@nestjs/swagger";
import { CreateMediaDto } from "./create-media.dto";

// DTO for updating Media
export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
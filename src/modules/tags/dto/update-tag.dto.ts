import { PartialType } from "@nestjs/swagger";
import { CreateTagDto } from "./create-tag.dto";

// DTO for updating Tag
export class UpdateTagDto extends PartialType(CreateTagDto) {}
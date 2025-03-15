import { IsNotEmpty, IsString } from "class-validator";

// DTO for Tag
export class CreateTagDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    slug: string;
  }

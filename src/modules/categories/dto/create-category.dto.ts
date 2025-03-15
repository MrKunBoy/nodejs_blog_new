import { IsNotEmpty, IsString } from "class-validator";

// DTO for Category
export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    slug: string;
  }

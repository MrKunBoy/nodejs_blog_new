import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for updating Category
export class UpdateCategoryDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    slug?: string;
  }
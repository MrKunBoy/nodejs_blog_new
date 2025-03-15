import { IsMongoId, IsNotEmpty } from "class-validator";

// DTO for PostCategory
export class CreatePostCategoryDto {
    @IsMongoId()
    @IsNotEmpty()
    post_id: string;
  
    @IsMongoId()
    @IsNotEmpty()
    category_id: string;
  }

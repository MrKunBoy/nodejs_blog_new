import { IsMongoId, IsNotEmpty } from "class-validator";

// DTO for PostTag
export class CreatePostTagDto {
    @IsMongoId()
    @IsNotEmpty()
    post_id: string;
  
    @IsMongoId()
    @IsNotEmpty()
    tag_id: string;
  }

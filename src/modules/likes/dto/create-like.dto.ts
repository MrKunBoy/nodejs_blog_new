import { IsMongoId, IsNotEmpty } from "class-validator";

// DTO for Like
export class CreateLikeDto {
    @IsMongoId()
    @IsNotEmpty()
    post_id: string;
  
    @IsMongoId()
    @IsNotEmpty()
    user_id: string;
  }

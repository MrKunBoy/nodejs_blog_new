import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for updating Comment
export class UpdateCommentDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  
    @IsOptional()
    @IsString()
    content?: string;
  }
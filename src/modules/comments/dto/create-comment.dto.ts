import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { IsMongoId } from 'class-validator';
// DTO for Comment
export class CreateCommentDto {
    @IsMongoId()
    @IsNotEmpty()
    post_id: string;
  
    @IsMongoId()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    content: string;
  
    @IsOptional()
    @IsMongoId()
    parent_id?: string;
  }

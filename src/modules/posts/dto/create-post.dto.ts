import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { IsMongoId } from 'class-validator';
export class CreatePostDto {
    @IsMongoId()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    content: string;
  
    @IsOptional()
    @IsString()
    excerpt?: string;
  
    @IsString()
    @IsNotEmpty()
    slug: string;
  
    @IsBoolean()
    @IsOptional()
    published?: boolean;
  }

import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// DTO for updating Post
export class UpdatePostDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    content?: string;
  
    @IsOptional()
    @IsString()
    excerpt?: string;
  
    @IsOptional()
    @IsString()
    slug?: string;
  
    @IsOptional()
    @IsBoolean()
    published?: boolean;
  }
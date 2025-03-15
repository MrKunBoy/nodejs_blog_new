import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for updating Media
export class UpdateMediaDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  
    @IsOptional()
    @IsString()
    file_path?: string;
  
    @IsOptional()
    @IsString()
    file_type?: string;
  }
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for updating Tag
export class UpdateTagDto {
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
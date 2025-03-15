import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

// DTO for Media
export class CreateMediaDto {
    @IsMongoId()
    @IsNotEmpty()
    user_id: string;
  
    @IsString()
    @IsNotEmpty()
    file_path: string;
  
    @IsString()
    @IsNotEmpty()
    file_type: string;
  }

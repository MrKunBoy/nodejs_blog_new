import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

// DTO for updating Setting
export class UpdateSettingDto {
    @IsMongoId()
    @IsNotEmpty()
    _id: string;
  
    @IsOptional()
    @IsString()
    key?: string;
  
    @IsOptional()
    @IsString()
    value?: string;
  }
import { IsNotEmpty, IsString } from "class-validator";

// DTO for Setting
export class CreateSettingDto {
    @IsString()
    @IsNotEmpty()
    key: string;
  
    @IsString()
    @IsNotEmpty()
    value: string;
  }

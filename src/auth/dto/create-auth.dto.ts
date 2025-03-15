import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  name: string;
}

export class CheckCodeAuthDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  code: string;
}

export class ChangePassworđto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  email: string;
}

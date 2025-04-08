import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsStrongPassword,
	MaxLength,
} from 'class-validator';

export class SignUpDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsNotEmpty()
	@MaxLength(50)
	first_name: string;

	@IsNotEmpty()
	@MaxLength(50)
	last_name: string;
}

export class CheckCodeAuthDto {
	@IsNotEmpty()
	_id: string;

	@IsNotEmpty()
	code: string;
}

export class ChangePassworDto {
	@IsNotEmpty()
	code: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsNotEmpty()
	confirmPassword: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;
}

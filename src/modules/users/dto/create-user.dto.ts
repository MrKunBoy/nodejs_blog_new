import { Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsDate,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	IsStrongPassword,
	Matches,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { Dayjs } from 'dayjs';
import { GENDER } from '../schemas/user.schema';

export class CreateUserDto {
	@IsNotEmpty()
	@MaxLength(50)
	first_name: string;

	@IsNotEmpty()
	@MaxLength(50)
	last_name: string;

	@IsNotEmpty()
	@MaxLength(50)
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;

	@IsOptional()
	phone?: string;

	@IsOptional()
	@IsEnum(GENDER)
	gender?: GENDER;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	date_of_birth?: Date;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAddressDto)
	address?: CreateAddressDto[];

	@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsString()
	codeId?: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	codeExpired?: Date;
}

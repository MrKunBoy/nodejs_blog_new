import { PartialType } from '@nestjs/swagger';
import {
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsDate,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { GENDER } from '../schemas/user.schema';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';

export class UpdateUserDto extends PartialType(
	CreateUserDto,
	// OmitType(CreateUserDto, ['email', 'password', 'name'] as const),
) {
	// @IsNotEmpty()
	// @MaxLength(50)
	// first_name: string;

	// @IsNotEmpty()
	// @MaxLength(50)
	// last_name: string;

	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	date_of_birth?: Date;

	@IsOptional()
	@IsEnum(GENDER)
	gender?: GENDER;

	@IsOptional()
	@IsString()
	image?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	codeId: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	codeExpired?: Date;

	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateAddressDto)
	address?: CreateAddressDto[];
}

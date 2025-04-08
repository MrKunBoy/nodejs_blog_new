import {
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsPostalCode,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateAddressDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(100)
	street: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	city: string;

	@IsString()
	@IsOptional()
	@MaxLength(50)
	state?: string;

	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	country: string;

	@IsNumberString()
	@IsOptional()
	@MaxLength(10)
	@IsPostalCode('US')
	postalCode?: number;
}

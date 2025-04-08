import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Category } from '../schemas/category.schema';
import mongoose from 'mongoose';

// DTO for Category
export class CreateCategoryDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsOptional()
	description?: string;

	@IsOptional()
	@IsArray()
	subcategories?: Category[];

	@IsOptional()
	isActive?: boolean;
}

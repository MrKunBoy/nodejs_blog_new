import { IsOptional, IsArray, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// Cập nhật DTO cho Update
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
// export class UpdateCategoryDto {
// 	@IsOptional()
// 	name?: string;

// 	@IsOptional()
// 	description?: string;

// 	@IsOptional()
// 	@IsArray()
// 	@IsString({ each: true }) // Đảm bảo mỗi phần tử là string (tên của subcategory)
// 	subcategories?: string[]; // subcategories là mảng các tên (string[])

// 	@IsOptional()
// 	isActive?: boolean;
// }

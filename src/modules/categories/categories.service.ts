import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepositoryInterface } from './interfaces/categories.interface';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { Category, CategoryDocument } from './schemas/category.schema';
import { SlugPipe } from '@/pipes/slug.pipe';
import { FindAllResponse } from '@/types/common.type';

@Injectable()
export class CategoriesService extends BaseServiceAbstract<Category> {
	constructor(
		@Inject('CategoryRepositoryInterface')
		private readonly categoryRepository: CategoryRepositoryInterface,
	) {
		super(categoryRepository);
	}

	async create(createCategory: CreateCategoryDto): Promise<Category> {
		try {
			const newCategory = await this.categoryRepository.create(createCategory);
			return this.categoryRepository.findOneById(newCategory.id);
		} catch (error) {
			throw new BadRequestException(
				'Error creating category: ' + error.message,
			);
		}
	}

	// async findAll(
	// 	filter?: object,
	// 	options?: object,
	// ): Promise<FindAllResponse<Category>> {
	// 	return this.categoryRepository.findAllWithSubFields(filter, {
	// 		...options,
	// 		populate: [{ path: 'subcategories', select: 'name' }],
	// 	});
	// }

	// async update(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
	// 	return this.categoryRepository.updateCategory(id, categoryData);
	// }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { SlugPipe } from '@/pipes/slug.pipe';
import {
	Category,
	CategoryDocument,
} from '@/modules/categories/schemas/category.schema';
import { CategoryRepositoryInterface } from '@/modules/categories/interfaces/categories.interface';
import { CreateCategoryDto } from '@/modules/categories/dto/create-category.dto';
import { FindAllResponse } from '@/types/common.type';

@Injectable()
export class CategoryRepository
	extends BaseRepositoryAbstract<CategoryDocument>
	implements CategoryRepositoryInterface
{
	constructor(
		@InjectModel(Category.name)
		private readonly category_model: Model<CategoryDocument>,
		private readonly slugPipe: SlugPipe,
	) {
		super(category_model);
	}

	// // Hàm tạo mới category
	// async create(createCateDto: CreateCategoryDto): Promise<CategoryDocument> {
	// 	const { name, description, subcategories, isActive } = createCateDto;

	// 	// Tạo slug từ tên danh mục
	// 	const slug = this.slugPipe.transform(name);

	// 	// Xử lý subcategories (danh mục con)
	// 	const subcategoryIds = [];

	// 	if (subcategories && subcategories.length > 0) {
	// 		for (const subcategory of subcategories) {
	// 			// Kiểm tra xem subcategory đã tồn tại chưa
	// 			let existingSubcategory = await this.category_model.findOne({
	// 				name: subcategory.name,
	// 			});

	// 			// Nếu chưa tồn tại, tạo mới
	// 			if (!existingSubcategory) {
	// 				existingSubcategory = new this.category_model({
	// 					name: subcategory.name,
	// 					slug: this.slugPipe.transform(subcategory.name),
	// 					isActive: subcategory.isActive ?? true,
	// 				});
	// 				await existingSubcategory.save(); // Lưu danh mục con
	// 			}

	// 			// Thêm ID của danh mục con vào mảng subcategoryIds
	// 			subcategoryIds.push(existingSubcategory._id);
	// 		}
	// 	}

	// 	// Tạo mới category
	// 	const newCategory = new this.category_model({
	// 		name,
	// 		slug,
	// 		description,
	// 		subcategories: subcategoryIds,
	// 		isActive: isActive ?? true,
	// 	});

	// 	// Lưu và trả về category đã tạo
	// 	return await newCategory.save();
	// }

	// async findOneById(
	// 	id: string,
	// 	projection?: string,
	// 	options?: object,
	// ): Promise<CategoryDocument> {
	// 	return this.category_model
	// 		.findById(id, projection, options)
	// 		.populate('subcategories', 'name')
	// 		.exec(); // Đảm bảo trả về một tài liệu Mongoose hợp lệ
	// }

	// async findAllWithSubFields(
	// 	condition: FilterQuery<CategoryDocument>,
	// 	options: {
	// 		projection?: string;
	// 		populate?: string[] | PopulateOptions | PopulateOptions[];
	// 		offset?: number;
	// 		limit?: number;
	// 	},
	// ): Promise<FindAllResponse<CategoryDocument>> {
	// 	const [count, items] = await Promise.all([
	// 		this.category_model.countDocuments({ ...condition, deleted_at: null }),
	// 		this.category_model
	// 			.find({ ...condition, deleted_at: null }, options?.projection || '', {
	// 				skip: options.offset || 0,
	// 				limit: options.limit || 10,
	// 			})
	// 			.populate(
	// 				options.populate ?? [{ path: 'subcategories', select: 'name' }],
	// 			)
	// 			.exec(),
	// 	]);
	// 	return {
	// 		count,
	// 		items,
	// 	};
	// }

	// async updateCategory(
	// 	id: string,
	// 	updateData: Partial<Category>,
	// ): Promise<CategoryDocument> {
	// 	const { subcategories, name, description, isActive } = updateData;

	// 	let subcategoryIds: mongoose.Types.ObjectId[] = [];

	// 	if (subcategories && subcategories.length > 0) {
	// 		for (const subcategory of subcategories) {
	// 			let existingSubcategory;

	// 			existingSubcategory = await this.category_model.findOne({
	// 				name: subcategory, // Tìm subcategory theo name
	// 			});

	// 			if (!existingSubcategory) {
	// 				existingSubcategory = await this.category_model.create({
	// 					name: subcategory.name,
	// 					slug: this.slugPipe.transform(subcategory.name),
	// 					isActive: subcategory.isActive ?? true,
	// 				});
	// 			}

	// 			subcategoryIds.push(existingSubcategory._id);
	// 		}
	// 	}

	// 	const updatedCategory = await this.category_model
	// 		.findByIdAndUpdate(
	// 			id,
	// 			{
	// 				name,
	// 				description,
	// 				isActive,
	// 				subcategories: subcategoryIds,
	// 				slug: this.slugPipe.transform(name),
	// 			},
	// 			{ new: true },
	// 		)
	// 		.populate('subcategories', 'name') // Hiển thị name
	// 		.exec();

	// 	return updatedCategory;
	// }
}

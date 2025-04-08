import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { Category } from '../schemas/category.schema';
import { FindAllResponse } from '@/types/common.type';

export type CategoryRepositoryInterface = BaseRepositoryInterface<Category>;

// export interface CategoryRepositoryInterface
// 	extends BaseRepositoryInterface<Category> {
// 	// findAllWithSubFields(
// 	// 	condition: object,
// 	// 	options: {
// 	// 		projection?: string;
// 	// 		populate?: string[] | any;
// 	// 		offset?: number;
// 	// 		limit?: number;
// 	// 	},
// 	// ): Promise<FindAllResponse<Category>>;

// 	// updateCategory(id: string, updateData: Partial<Category>): Promise<Category>;
// }

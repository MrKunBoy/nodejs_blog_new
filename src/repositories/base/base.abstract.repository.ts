import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';
import { BaseSchema } from '@/modules/shared/base/base.schema';

export abstract class BaseRepositoryAbstract<T extends BaseSchema>
	implements BaseRepositoryInterface<T>
{
	protected constructor(private readonly model: Model<T>) {
		this.model = model;
	}

	async create(dto: T | any): Promise<T> {
		const created_data = await this.model.create(dto);
		return created_data.save() as Promise<T>;
	}

	async findOneById(
		id: string,
		projection?: string,
		options?: QueryOptions<T>,
	): Promise<T> {
		// Tạo truy vấn
		const query = await this.model.findById(id, projection, options);
		return query?.deleted_at ? null : query;
	}
	async findOneByCondition(condition = {}): Promise<T> {
		return await this.model
			.findOne({
				...condition,
				deleted_at: null,
			})
			.exec();
	}

	async findAll(
		condition: FilterQuery<T>,
		options?: QueryOptions<T>,
	): Promise<FindAllResponse<T>> {
		const [count, items] = await Promise.all([
			this.model.countDocuments({ ...condition, deleted_at: null }),
			this.model.find(
				{ ...condition, deleted_at: null },
				options?.projection,
				options,
			),
		]);
		return {
			count,
			items,
		};
	}

	async findOneAndUpdate(condition: object, dto: Partial<T>): Promise<T> {
		return await this.model.findOneAndUpdate(condition, dto, { new: true });
	}

	async update(id: string, dto: Partial<T>): Promise<T> {
		return await this.model.findByIdAndUpdate(
			{ _id: id, deleted_at: null },
			dto,
			{ new: true },
		);
	}

	async softDelete(id: string): Promise<boolean> {
		const delete_item = await this.model.findById(id);
		if (!delete_item) {
			return false;
		}

		return !!(await this.model
			.findByIdAndUpdate<T>(id, {
				deleted_at: new Date(),
			})
			.exec());
	}

	async permanentlyDelete(id: string): Promise<boolean> {
		const delete_item = await this.model.findById(id);
		if (!delete_item) {
			return false;
		}
		return !!(await this.model.findByIdAndDelete(id));
	}

	async restore(id: string): Promise<boolean> {
		const restoredItem = await this.model
			.findByIdAndUpdate(id, { deleted_at: null }, { new: true })
			.exec();

		return !!restoredItem; // Trả về true nếu khôi phục thành công
	}

	async insertMany(items: T[]): Promise<T[]> {
		return (await this.model.insertMany(items)) as any;
	}

	async count(condition: object): Promise<number> {
		return await this.model.countDocuments(condition);
	}
}

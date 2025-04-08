import { FindAllResponse } from 'src/types/common.type';
import { BaseSchema } from '@/modules/shared/base/base.schema';
import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { BaseServiceInterface } from './base.interface.service';

export abstract class BaseServiceAbstract<T extends BaseSchema>
	implements BaseServiceInterface<T>
{
	constructor(private readonly repository: BaseRepositoryInterface<T>) {}

	async create(create_dto: T | any): Promise<T> {
		return await this.repository.create(create_dto);
	}

	async findAll(
		filter?: object,
		options?: object,
	): Promise<FindAllResponse<T>> {
		return await this.repository.findAll(filter, options);
	}

	async findOne(id: string) {
		return await this.repository.findOneById(id);
	}

	async findOneByCondition(filter: Partial<T>) {
		const result = await this.repository.findOneByCondition(filter);
		return result;
	}

	async update(id: string, update_dto: T | any) {
		return await this.repository.update(id, update_dto);
	}

	async remove(id: string) {
		return await this.repository.softDelete(id);
	}

	async restore(id: string): Promise<boolean> {
		return await this.repository.restore(id);
	}
}

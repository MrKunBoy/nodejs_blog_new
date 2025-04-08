import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import {
	UserRole,
	UserRoleDocument,
} from '@/modules/user-roles/schemas/user-role.schema';
import { UserRolesRepositoryInterface } from '@/modules/user-roles/interfaces/user-roles.interface';
import { FindAllResponse } from '@/types/common.type';

@Injectable()
export class UserRolesRepository
	extends BaseRepositoryAbstract<UserRoleDocument>
	implements UserRolesRepositoryInterface
{
	constructor(
		@InjectModel(UserRole.name)
		private readonly user_role_model: Model<UserRoleDocument>,
	) {
		super(user_role_model);
	}
	findAllWithSubFields(
		condition: object,
		options: {
			projection?: string;
			populate?: string[] | any;
			offset?: number;
			limit?: number;
		},
	): Promise<FindAllResponse<UserRole>> {
		throw new Error('Method not implemented.');
	}
}

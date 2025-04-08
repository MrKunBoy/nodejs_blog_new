import { BaseRepositoryAbstract } from '@/repositories/base/base.abstract.repository';
import { Get, Inject, Injectable } from '@nestjs/common';
import { UserRole } from './schemas/user-role.schema';
import { UserRolesRepositoryInterface } from './interfaces/user-roles.interface';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { FindAllResponse } from '@/types/common.type';

@Injectable()
export class UserRolesService extends BaseServiceAbstract<UserRole> {
	constructor(
		@Inject('UserRolesRepositoryInterface')
		private readonly userRoleRepository: UserRolesRepositoryInterface,
	) {
		super(userRoleRepository);
	}
}

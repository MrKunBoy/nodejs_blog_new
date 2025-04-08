import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';
import { UserRole } from '../schemas/user-role.schema';
import { FindAllResponse } from '@/types/common.type';

export type UserRolesRepositoryInterface = BaseRepositoryInterface<UserRole>;

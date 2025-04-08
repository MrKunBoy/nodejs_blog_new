import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { UsersRepositoryInterface } from './interfaces/user.interface';
import { UserRolesService } from '../user-roles/user-roles.service';
import { FindAllResponse } from '@/types/common.type';
import { USER_ROLE } from '../user-roles/schemas/user-role.schema';
import { hashContentHelper } from '@/shared/helpers/utils';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
	constructor(
		@Inject('UsersRepositoryInterface')
		private readonly usersRepository: UsersRepositoryInterface,
		private readonly userRolesService: UserRolesService,
	) {
		super(usersRepository);
	}

	//create a new user
	async create(createUserDto: CreateUserDto): Promise<User> {
		//check if the default user role exists
		let user_role = await this.userRolesService.findOneByCondition({
			name: USER_ROLE.USER,
		});

		if (!user_role) {
			//create a default role if it doesn't exist
			user_role = await this.userRolesService.create({
				name: USER_ROLE.USER,
			});
		}

		// Hash the password
		const hashed_password = await hashContentHelper(createUserDto.password);

		// Generate a new unique name for the user
		let new_name = `${createUserDto.email.split('@')[0]}${Math.floor(
			10 + Math.random() * (999 - 10),
		)}`;
		// Check if the generated name already exists
		let existed_user = await this.usersRepository.findOneByCondition({
			name: new_name,
		});
		while (existed_user) {
			new_name = `${createUserDto.email.split('@')[0]}${Math.floor(
				10 + Math.random() * (999 - 10),
			)}`;
			existed_user = await this.usersRepository.findOneByCondition({
				name: new_name,
			});
		}

		//create and return the new user
		const user = await this.usersRepository.create({
			...createUserDto,
			name: new_name,
			role: user_role._id,
			password: hashed_password,
		});

		return user;
	}

	// Retrieve all users with optional filters and pagination
	async findAll(
		filter?: object,
		options?: object,
	): Promise<FindAllResponse<User>> {
		return await this.usersRepository.findAllWithSubFields(filter, {
			...options,
			populate: ['role'],
		});
	}

	// Get user by email
	async getUserByEmail(email: string): Promise<User> {
		try {
			const user = await this.usersRepository.findOneByCondition({ email });
			if (!user) {
				throw new NotFoundException();
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	// Get user along with their role
	async getUserWithRole(user_id: string): Promise<User> {
		try {
			const user = await this.usersRepository.getUserWithRole(user_id);
			if (!user) {
				throw new NotFoundException('User not found');
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	// Set the refresh token for a user
	async setCurrentRefreshToken(
		id: string,
		hashed_token: string,
	): Promise<void> {
		try {
			await this.usersRepository.update(id, {
				current_refresh_token: hashed_token,
			});
		} catch (error) {
			throw error;
		}
	}
}

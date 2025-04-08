import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseInterceptors,
	SerializeOptions,
	UseGuards,
	ParseIntPipe,
	DefaultValuePipe,
	NotFoundException,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { ApiDocsPagination } from '@/decorator/swagger-form-daata.decorator';
import { Roles } from '@/decorator/roles.decorator';
import { USER_ROLE } from '../user-roles/schemas/user-role.schema';
import { RolesGuard } from '@/auth/passport/guards/roles.guard';
import { Public } from '@/decorator/auth.decorator';
import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('token')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiOperation({ summary: 'Admin create new user' })
	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@ApiBody({
		type: CreateUserDto,
	})
	@ApiResponse({
		status: 201,
		description: 'The user has been successfully created.',
		type: User,
	})
	@ApiResponse({ status: 400, description: 'Invalid input' })
	async create(@Body() createUserDto: CreateUserDto) {
		try {
			const user = await this.usersService.create(createUserDto);
			return user;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@SerializeOptions({
		excludePrefixes: ['first', 'last'], //loại bỏ các property mình muốn dựa vào prefix
	})
	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiDocsPagination(User.name)
	@Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	async findAll(
		@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
	) {
		const options = {
			offset,
			limit,
		};
		return this.usersService.findAll({}, options);
	}

	@Get(':id')
	@Public()
	async findOne(@Param('id') id: string) {
		return await this.usersService.findOne(id);
	}

	@Patch(':id')
	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Update a user' })
	async update(
		@Param('id') id: string,
		@Body() update_dto: UpdateUserDto,
	): Promise<User> {
		try {
			return await this.usersService.update(id, update_dto);
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Patch(':id/restore')
	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Restore a soft-deleted user' })
	async restore(@Param('id') id: string) {
		const restored = await this.usersService.restore(id);
		if (!restored) {
			throw new NotFoundException('User not found');
		}
		return restored;
	}

	@Delete(':id')
	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Delete a user' })
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}

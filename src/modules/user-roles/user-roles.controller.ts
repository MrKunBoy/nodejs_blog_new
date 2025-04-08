import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UseGuards,
	NotFoundException,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';
import { USER_ROLE, UserRole } from './schemas/user-role.schema';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/decorator/roles.decorator';
import { RolesGuard } from '@/auth/passport/guards/roles.guard';

@Controller('user-roles')
@ApiTags('user-roles')
@ApiBearerAuth('token')
@UseInterceptors(MongooseClassSerializerInterceptor(UserRole))
export class UserRolesController {
	constructor(private readonly userRolesService: UserRolesService) {}

	@Post()
	@ApiOperation({ summary: 'Create new a role user' })
	create(@Body() createUserRoleDto: CreateUserRoleDto) {
		return this.userRolesService.create(createUserRoleDto);
	}

	@Get()
	@ApiOperation({ summary: 'Get all role user' })
	async findAll() {
		return await this.userRolesService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get role user by Id' })
	findOne(@Param('id') id: string) {
		return this.userRolesService.findOne(id);
	}

	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Update role user' })
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUserRoleDto: UpdateUserRoleDto,
	) {
		return this.userRolesService.update(id, updateUserRoleDto);
	}

	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@ApiOperation({ summary: 'Delete role user' })
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userRolesService.remove(id);
	}

	@Roles(USER_ROLE.ADMIN)
	@UseGuards(RolesGuard)
	@Patch('restore/:id')
	@ApiOperation({ summary: 'Restore a soft-deleted role user' })
	async restore(@Param('id') id: string) {
		const restored = await this.userRolesService.restore(id);
		if (!restored) {
			throw new NotFoundException('User not found');
		}
		return restored;
	}
}

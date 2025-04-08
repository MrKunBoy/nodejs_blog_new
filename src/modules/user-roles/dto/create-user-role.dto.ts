import { IsEnum, IsOptional, MinLength } from "class-validator";
import { USER_ROLE } from "../schemas/user-role.schema";

export class CreateUserRoleDto {
	@IsEnum(USER_ROLE)
	name: USER_ROLE;

	@IsOptional()
	@MinLength(1)
	description: string;
}
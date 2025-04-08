import { ROLES } from '@/decorator/roles.decorator';
import { UserRole } from '@/modules/user-roles/schemas/user-role.schema';
import { RequestWithUser } from '@/types/requests.type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles: string[] = this.reflector.getAllAndOverride(ROLES, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!roles || roles.length === 0) {
			return true;
		}
		const request: RequestWithUser = context.switchToHttp().getRequest();

		return roles.includes(request.user.role as unknown as string);
	}
}

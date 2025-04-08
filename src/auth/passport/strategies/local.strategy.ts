import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string) {
		const user = await this.authService.getAuthenticatedUser(email, password);
		if (!user) {
			throw new UnauthorizedException({
				message: ERRORS_DICTIONARY.USER_NOT_ACTIVE,
				details: 'Invalid username or password!!',
			});
		}
		if (user.isActive === false) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
				details: 'User account is not active!!',
			});
		}
		return user;
	}
}

import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { refresh_token_public_key } from 'src/constraints/jwt.constraint';
import { AuthService } from '@/auth/auth.service';
import { TokenPayload } from '../interfaces/token.interface';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'refresh_token',
) {
	constructor(private readonly auth_service: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: refresh_token_public_key,
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: TokenPayload) {
		try {
			return await this.auth_service.getUserIfRefreshTokenMatched(
				payload.user_id,
				request.headers.authorization?.split('Bearer ')[1],
			);
		} catch (error) {
			throw new UnauthorizedException({
				message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
				details: 'Refresh token not valid',
			});
		}
	}
}

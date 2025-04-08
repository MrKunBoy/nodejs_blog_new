import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	UnauthorizedException,
	Logger,
} from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import {
	hashContentHelper,
	verifyPlainContentWithHashedContent,
} from '@/shared/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { ChangePassworDto, CheckCodeAuthDto, SignUpDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '@/modules/users/schemas/user.schema';
import {
	access_token_private_key,
	refresh_token_private_key,
} from '@/constraints/jwt.constraint';
import { TokenPayload } from './passport/interfaces/token.interface';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from '@/modules/user-roles/schemas/user-role.schema';
import { ERRORS_DICTIONARY } from '@/constraints/error-dictionary.constraint';

@Injectable()
export class AuthService {
	// private saltRound = 10;
	constructor(
		private config_service: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly mailerService: MailerService,
	) {}

	async signUp(sign_up_dto: SignUpDto) {
		try {
			// Check if the user already exists
			const existed_user = await this.usersService.findOneByCondition({
				email: sign_up_dto.email,
			});

			if (existed_user) {
				throw new ConflictException({
					message: ERRORS_DICTIONARY.EMAIL_EXISTED,
					details: 'Email already existed!!',
				});
			}
			// // Hash the password
			// const hashed_password = await hashContentHelper(sign_up_dto.password);

			// Generate a unique codeId for activation
			const codeId = uuidv4();
			// Create the new user (including random username and other fields)
			const user = await this.usersService.create({
				...sign_up_dto,
				// password: hashed_password,
				isActive: false,
				codeId: codeId,
				codeExpired: dayjs().add(1, 'hours').toDate(), // manipulate
			});

			//send the activation email
			this.mailerService.sendMail({
				to: user.email, // list of receivers
				subject: 'Activate your account', // Subject line
				template: 'register.hbs',
				context: {
					name: user?.name ?? user.email,
					activationCode: codeId,
				},
			});
			// Generate tokens
			const refresh_token = this.generateRefreshToken({
				user_id: user._id.toString(),
			});
			// Store the refresh token
			await this.storeRefreshToken(user._id.toString(), refresh_token);
			return {
				access_token: this.generateAccessToken({
					user_id: user._id.toString(),
				}),
				refresh_token,
			};
		} catch (error) {
			Logger.error('Lỗi trong quá trình đăng ký', error.stack);
			throw new BadRequestException(
				'Tạo người dùng thất bại: ' + error.message,
			);
		}
	}

	async signIn(user_id: string) {
		try {
			const access_token = this.generateAccessToken({
				user_id,
			});
			const refresh_token = this.generateRefreshToken({
				user_id,
			});
			await this.storeRefreshToken(user_id, refresh_token);
			return {
				access_token,
				refresh_token,
			};
		} catch (error) {
			throw error;
		}
	}

	async checkCode(codeAuthDto: CheckCodeAuthDto) {
		try {
			const user = await this.usersService.findOneByCondition({
				_id: codeAuthDto._id,
				codeId: codeAuthDto.code,
			});
			if (!user) {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.USER_NOT_FOUND,
					details: 'User not found',
				});
			}

			//compare code
			const isCodeValid = dayjs().isBefore(user.codeExpired);
			if (!isCodeValid) {
				throw new BadRequestException({
					message: ERRORS_DICTIONARY.CODE_EXPIRED,
					details: 'Activation code expired',
				});
			}

			const updateDto = {
				isActive: true,
				codeId: null,
				codeExpired: null,
			};
			//update user
			const updatedUser = await this.usersService.update(
				codeAuthDto._id,
				updateDto,
			);
			return updatedUser;
		} catch (error) {
			// Log the error for debugging purposes
			Logger.error('Error in checkCode:', error.stack);
			throw error;
		}
	}

	async retryActive(email: string) {
		const user = await this.usersService.findOneByCondition({ email });
		if (!user) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.GET_USER_NOT_FOUND,
				details: 'Check mail not found',
			});
		}
		if (user.isActive) {
			throw new BadRequestException('Account already active');
		}
		const codeId = uuidv4();
		//update data
		await this.usersService.update(user._id.toString(), {
			codeId: codeId,
			codeExpired: dayjs().add(1, 'hours').toDate(), // manipulate
		});

		//re-send code
		this.mailerService.sendMail({
			to: user.email, // list of receivers
			subject: 'Activate your account', // Subject line
			template: 'register.hbs',
			context: {
				name: user?.name ?? user.email,
				activationCode: codeId,
			},
		});
		return user;
	}

	//quen mat khau
	async retryPassword(email: string) {
		const user = await this.usersService.findOneByCondition({ email });
		if (!user) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.GET_USER_NOT_FOUND,
				details: 'Check mail not found',
			});
		}

		const codeId = uuidv4();
		//update data
		const updateUser = await this.usersService.update(user._id.toString(), {
			codeId: codeId,
			codeExpired: dayjs().add(1, 'hours').toDate(), // manipulate
		});
		// const updateUser = await this.usersService.getUserByEmail(email);
		// console.log('updated user:', updateUser);
		//re-send code
		this.mailerService.sendMail({
			to: user.email, // list of receivers
			subject: 'Change your password', // Subject line
			template: 'register.hbs',
			context: {
				name: user?.name ?? user.email,
				activationCode: codeId,
			},
		});
		return updateUser;
	}

	//lay code tu email va doi mat khau
	async changePassword(data: ChangePassworDto) {
		if (data.confirmPassword !== data.password) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.CONTENT_NOT_MATCH,
				details: 'Confirm password not match',
			});
		}
		//check email
		const user = await this.usersService.findOneByCondition({
			email: data.email,
		});
		if (!user) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.GET_USER_NOT_FOUND,
				details: 'Check email not found',
			});
		}

		//compare code
		const isCodeValid = dayjs().isBefore(user.codeExpired);
		if (!isCodeValid) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.CONTENT_NOT_MATCH,
				details: 'Invalid activation code or expired',
			});
		} else {
			//update password
			const newPassword = await hashContentHelper(data.password);
			await this.usersService.update(user._id.toString(), {
				password: newPassword,
				codeId: null,
				codeExpired: null,
			});
			return { isCodeValid };
		}
	}

	//logic xac thuc user
	async getAuthenticatedUser(email: string, password: string): Promise<User> {
		try {
			const user = await this.usersService.getUserByEmail(email);
			if (!user) return null;
			const isVaidPassword = await verifyPlainContentWithHashedContent(
				password,
				user.password,
			);
			if (!isVaidPassword) return null;
			return user;
		} catch (error) {
			throw new BadRequestException({
				message: ERRORS_DICTIONARY.WRONG_CREDENTIALS,
				details: 'Wrong credentials!!',
			});
		}
	}

	async getUserIfRefreshTokenMatched(
		user_id: string,
		refresh_token: string,
	): Promise<User> {
		try {
			const user = await this.usersService.findOneByCondition({
				_id: user_id,
			});
			if (!user) {
				throw new UnauthorizedException({
					message: ERRORS_DICTIONARY.UNAUTHORIZED_EXCEPTION,
					details: 'Unauthorized',
				});
			}
			const isToken = await verifyPlainContentWithHashedContent(
				refresh_token,
				user.current_refresh_token,
			);
			console.log('isToken: ', isToken);
			if (!isToken) return null;
			return user;
		} catch (error) {
			throw error;
		}
	}

	generateAccessToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			algorithm: 'RS256',
			privateKey: access_token_private_key,
			expiresIn: `${this.config_service.get<string>(
				'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	private generateRefreshToken(payload: TokenPayload) {
		return this.jwtService.sign(payload, {
			algorithm: 'RS256',
			privateKey: refresh_token_private_key,
			expiresIn: `${this.config_service.get<string>(
				'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
			)}s`,
		});
	}

	private async storeRefreshToken(
		user_id: string,
		token: string,
	): Promise<void> {
		try {
			const hashed_token = await hashContentHelper(token);
			await this.usersService.setCurrentRefreshToken(user_id, hashed_token);
		} catch (error) {
			throw error;
		}
	}
}

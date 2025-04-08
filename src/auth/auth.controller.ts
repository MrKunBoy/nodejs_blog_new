import {
	Post,
	Controller,
	UseGuards,
	Body,
	Req,
	BadRequestException,
	UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/guards/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/auth.decorator';
import { ChangePassworDto, CheckCodeAuthDto, SignUpDto } from './dto/auth.dto';
import { RequestWithUser } from '@/types/requests.type';
import { JwtRefreshTokenGuard } from './passport/guards/jwt-refresh-token.guard';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiConflictResponse,
	ApiCreatedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { TransformInterceptor } from '@/interceptors/transform.interceptor';
import MongooseClassSerializerInterceptor from '@/interceptors/mongoose-class-serializer.interceptor';
import { User } from '@/modules/users/schemas/user.schema';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({
		//nếu muốn dùng auto login swagger nên chỉnh sửa isActive trong database
		type: SignUpDto,
		examples: {
			user_1: {
				value: {
					first_name: 'John',
					last_name: 'Doe',
					email: 'johndoe@example.com',
					password: '1232@asdS',
				} as SignUpDto,
			},
			user_2: {
				value: {
					first_name: 'Michael',
					last_name: 'Smith',
					email: 'michaelsmith@example.com',
					password: '1232@asdS',
				} as SignUpDto,
			},
		},
	})
	@Post('sign-up')
	@Public()
	@ApiOperation({ summary: 'Sign up a new user' })
	@ResponseMessage('Đăng ký người dùng thành công')
	async signUp(@Body() sign_up_dto: SignUpDto) {
		try {
			return await this.authService.signUp(sign_up_dto);
		} catch (error) {
			throw new BadRequestException('Đăng ký thất bại: ' + error.message);
		}
	}

	@Public()
	@ResponseMessage('Fetch check code')
	@Post('check-code')
	checkCode(@Body() codeAuthDto: CheckCodeAuthDto) {
		return this.authService.checkCode(codeAuthDto);
	}

	@ResponseMessage('Fetch login')
	@Public()
	@ApiOperation({
		summary: 'User login',
		description: 'Authenticate user and return access token.',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				email: { type: 'string', example: 'johndoe@example.com' },
				password: { type: 'string', example: '1232@asdS' },
			},
			required: ['email', 'password'],
		},
	})
	@UseGuards(LocalAuthGuard)
	@Post('sign-in')
	@ApiResponse({
		status: 401,
		description: 'Unauthorized',
		content: {
			'application/json': {
				example: {
					statusCode: 400,
					message: 'Wrong credentials!!',
					error: 'Bad Request',
				},
			},
		},
	})
	@Post('sign-in')
	async signIn(@Req() request: RequestWithUser) {
		console.log('User in signIn:', request.user);
		if (!request.user) {
			throw new BadRequestException('Tài khoản hoặc mật khẩu không đúng');
		}
		return await this.authService.signIn(request.user._id.toString());
	}

	@Public()
	@ResponseMessage('Fetch retry active')
	@Post('retry-active')
	@ApiBody({
		type: String,
		examples: {
			email_1: {
				value: { email: 'johndoe@example.com' },
			},
			email_2: {
				value: { email: 'michaelsmith@example.com' },
			},
		},
	})
	retryActive(@Body('email') email: string) {
		return this.authService.retryActive(email);
	}

	@Post('retry-password')
	@Public()
	@ResponseMessage('Fetch retry password')
	@ApiBody({
		type: String,
		examples: {
			email_1: {
				value: { email: 'johndoe@example.com' },
			},
			email_2: {
				value: { email: 'michaelsmith@example.com' },
			},
		},
	})
	retryPassword(@Body('email') email: string) {
		return this.authService.retryPassword(email);
	}

	@Post('change-password')
	@ResponseMessage('Fetch change password')
	@Public()
	changePassword(@Body() data: ChangePassworDto) {
		return this.authService.changePassword(data);
	}

	@UseGuards(JwtRefreshTokenGuard)
	@ResponseMessage('Fetch refresh token')
	@Post('refresh')
	async refreshAccessToken(@Req() request: RequestWithUser) {
		const { user } = request;
		const access_token = this.authService.generateAccessToken({
			user_id: user._id.toString(),
		});
		return {
			access_token,
		};
	}
}

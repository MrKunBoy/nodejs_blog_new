import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/strategies/local.strategy';
import { JwtRefreshTokenStrategy } from './passport/strategies/jwt-refresh-token.strategy';
import { JwtAccessTokenStrategy } from './passport/strategies/jwt-access-token.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/modules/users/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '@/modules/users/users.service';
import { UserRolesModule } from '@/modules/user-roles/user-roles.module';

@Module({
	imports: [
		UsersModule,
		UserRolesModule,
		PassportModule,
		JwtModule.register({}),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtAccessTokenStrategy,
		JwtRefreshTokenStrategy,
	],
	exports: [AuthService],
})
export class AuthModule {}

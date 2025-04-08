import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/modules/users/users.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MediasModule } from './modules/medias/medias.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { JwtAccessTokenGuard } from './auth/passport/guards/jwt-access-token.guard';
import { GlobalExceptionFilter } from './exception-filters/global-exception.filter';
import { BullModule } from '@nestjs/bullmq';
import * as Joi from 'joi';
import { database_config } from './configs/configuration.config';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision')
					.default('development'),
				PORT: Joi.number().port().required(),
				DATABASE_PORT: Joi.number().port().required(),
				DATABASE_USERNAME: Joi.string().min(4).required(),
				DATABASE_PASSWORD: Joi.string().min(4).required(),
				DATABASE_HOST: Joi.string().required(),
				DATABASE_URI: Joi.string().required(),
				AWS_S3_PUBLIC_BUCKET: Joi.string().required(),
				AWS_S3_REGION: Joi.string().required(),
				AWS_S3_ACCESS_KEY_ID: Joi.string().required(),
				AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: false,
			},
			load: [database_config],
			isGlobal: true,
			cache: true,
			expandVariables: true,
			envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('MONGODB_URI'),
			}),
			inject: [ConfigService],
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('HOST_MAIL'),
					port: configService.get<number>('PORT_MAIL'),
					ignoreTLS: true,
					secure: true,
					auth: {
						user: configService.get<string>('MAILDEV_INCOMING_USER'),
						pass: configService.get<string>('MAILDEV_INCOMING_PASS'),
					},
				},
				defaults: {
					from: '"No Reply" <no-reply@localhost>',
				},
				// preview: true,
				template: {
					dir: process.cwd() + '/src/mail/templates/',
					adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		PostsModule,
		CommentsModule,
		CategoriesModule,
		TagsModule,
		NotificationsModule,
		SettingsModule,
		MediasModule,
		UserRolesModule,
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				connection: {
					host: configService.get('REDIS_HOST'),
					port: configService.get('REDIS_PORT'),
				},
			}),
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: JwtAccessTokenGuard },
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		{ provide: APP_FILTER, useClass: GlobalExceptionFilter },
	],
})
export class AppModule {}

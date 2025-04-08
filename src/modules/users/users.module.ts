import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchemaFactory } from './schemas/user.schema';
import { Posts, PostSchema } from '../posts/schemas/post.schema';
import { UserRolesModule } from '../user-roles/user-roles.module';
import {
	Notification,
	NotificationSchema,
} from '../notifications/schemas/notification.schema';
import { UsersRepository } from '@/repositories/users.repository';

@Module({
	imports: [
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: UserSchemaFactory,
				inject: [getModelToken(Posts.name)],
				imports: [
					MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
				],
			},
		]),
		UserRolesModule,
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		{ provide: 'UsersRepositoryInterface', useClass: UsersRepository },
	],
	exports: [UsersService],
})
export class UsersModule {}

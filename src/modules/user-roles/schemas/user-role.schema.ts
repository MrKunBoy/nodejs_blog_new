import { BaseSchema } from '@/modules/shared/base/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type UserRoleDocument = HydratedDocument<UserRole>;

export enum USER_ROLE {
	ADMIN = 'Admin',
	USER = 'User',
	GUEST = 'Guest',
	AUTHOR = 'Author',
}

@Schema({
	collection: 'user-roles',
	timestamps: true,
})
// @Exclude()
export class UserRole extends BaseSchema {
	@Prop({
		unique: true,
		default: USER_ROLE.USER,
		enum: USER_ROLE,
		required: true,
	})
	@Expose({ name: 'role', toPlainOnly: true }) // Đảm bảo name hiển thị đúng
	name: string;

	@Prop()
	@Expose()
	_description: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);

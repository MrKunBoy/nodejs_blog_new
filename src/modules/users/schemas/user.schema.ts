import { BaseSchema } from '@/modules/shared/base/base.schema';
import { UserRole } from '@/modules/user-roles/schemas/user-role.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Address, AddressSchema } from './address.schema';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { PostDocument } from '@/modules/posts/schemas/post.schema';
import { NextFunction } from 'express';
import { IsOptional } from 'class-validator';

// Define the User document type
export type UserDocument = HydratedDocument<User>;

export enum GENDER {
	MALE = 'Male',
	FEMALE = 'Female',
	OTHER = 'Other',
}

@Schema({ timestamps: true, toJSON: { getters: true, virtuals: true } }) // Automatically adds createdAt and updatedAt fields
export class User extends BaseSchema {
	constructor(user: {
		first_name?: string;
		last_name?: string;
		email?: string;
		name?: string;
		password?: string;
		role?: mongoose.Types.ObjectId;
		gender?: GENDER;
		phone?: string;
	}) {
		super();
		this.first_name = user?.first_name;
		this.last_name = user?.last_name;
		this.email = user?.email;
		this.name = user?.name;
		this.password = user?.password;
		this.role = user?.role;
		this.gender = user?.gender;
		this.phone = user?.phone;
	}

	@Prop({
		required: true,
		minlength: 2,
		maxlength: 60,
		set: (first_name: string) => {
			return first_name.trim();
		},
	})
	first_name: string;

	@Prop({
		required: true,
		minlength: 2,
		maxlength: 60,
		set: (last_name: string) => {
			return last_name.trim();
		},
	})
	last_name: string;

	@Prop({ required: true, unique: true }) // Make name required
	name: string;

	@Prop({
		required: true,
		unique: true,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
	}) // Make email required and unique
	email: string;

	@Exclude()
	@Prop({ required: true }) // Make password required
	password: string;

	@Prop({
		match: /^([+]\d{1,3})?\d{10}$/,
		get: (phone: string) => {
			if (!phone) {
				return;
			}
			const last_three_digits = phone.slice(phone.length - 4);
			return `****-***-${last_three_digits}`;
		},
	})
	@IsOptional()
	phone?: string;

	@Prop()
	date_of_birth?: Date;

	@Prop({
		type: [AddressSchema],
	})
	@IsOptional()
	@Type(() => Address)
	address?: Address[];

	@Prop({
		default:
			'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
	})
	image?: string;

	@Prop({ enum: GENDER }) // Corrected default value to 'OTHER'
	gender: GENDER;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserRole',
		required: true,
	})
	@Type(() => UserRole)
	@Transform((value) => value.obj?.role?.name?.toString() ?? 'Unknown', {
		toClassOnly: true,
	})
	role: UserRole | mongoose.Types.ObjectId;

	@Prop({ default: 'LOCAL' }) // Default account type
	accountType: string;

	@Prop({ default: true }) // Default isActive to false
	isActive: boolean;

	default_address?: string;

	@Prop() // Code ID is optional
	codeId?: string;

	@Prop() // Code expiration date is optional
	codeExpired?: Date;

	@Prop()
	@Exclude()
	current_refresh_token?: string;

	@Prop({
		default: 'cus_mock_id',
	})
	@Exclude()
	stripe_customer_id: string;

	@Expose({ name: 'full_name' })
	get fullName(): string {
		return `${this.first_name} ${this.last_name}`;
	}
}

// Create the User schema
export const UserSchema = SchemaFactory.createForClass(User);

export const UserSchemaFactory = (post_model: Model<PostDocument>) => {
	const user_schema = UserSchema;

	user_schema.pre('findOneAndDelete', async function (next: NextFunction) {
		// OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
		const user = await this.model.findOne(this.getFilter());
		await Promise.all([
			post_model
				.deleteMany({
					user: user._id,
				})
				.exec(),
		]);
		return next();
	});

	user_schema.virtual('default_address').get(function (this: UserDocument) {
		if (this.address.length) {
			return `${(this.address[0].street && ' ') || ''}${this.address[0].city} ${
				this.address[0].state
			} ${this.address[0].country}`;
		}
		return 'No address available';
	});

	user_schema.index({ 'address.country': 1 });
	user_schema.index({ name: 1, email: 1 });
	user_schema.index({ date_of_birth: 1 });

	return user_schema;
};

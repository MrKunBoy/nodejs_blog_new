import { BaseSchema } from '@/modules/shared/base/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;
@Schema({ _id: false }) // Không tạo _id riêng cho mỗi address
export class Address {
	@Prop({ required: true })
	street: string;

	@Prop({ required: true })
	city: string;

	@Prop({ required: true })
	state: string;

	@Prop({ required: true })
	country: string;

	@Prop({ required: true })
	@Exclude()
	postalCode: number;

	@Prop({ default: false }) // Đánh dấu có phải địa chỉ mặc định không
	isDefault: boolean;
}

// @Schema()
// export class Address extends BaseSchema {
//     @Prop({ minlength: 2, maxlength: 120 })
//     street?: string;

//     @Prop({ required: true, minlength: 2, maxlength: 50 })
//     state: string;

//     @Prop({ required: true, minlength: 2, maxlength: 50 })
//     city: string;

//     @Prop({ required: false, minlength: 2, maxlength: 50 })
//     postal_code?: number;

//     @Prop({ required: true, minlength: 2, maxlength: 50 })
//     country: string;
// }

export const AddressSchema = SchemaFactory.createForClass(Address);

import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class BaseSchema {
	_id?: ObjectId | string;

	@Expose() //xuat hien o responses
	@Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
	id?: string;

	@Prop({ default: null })
	deleted_at?: Date;
}

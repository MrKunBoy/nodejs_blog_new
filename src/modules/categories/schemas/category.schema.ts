import { BaseSchema } from '@/modules/shared/base/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { HydratedDocument, Types } from 'mongoose';

// Define the Category document type
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories' }) // Automatically adds createdAt and updatedAt fields
export class Category extends BaseSchema {
	@Prop({ required: true, unique: true }) // Unique category name
	name: string;

	@Prop({ required: true, unique: true }) // SEO-friendly slug
	slug: string;

	@Prop()
	description: string;

	@Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Category' })
	@Type(() => Category)
	subcategories?: Category[];

	@Prop({ default: true })
	isActive: boolean;
}

// Create the Category schema
export const CategorySchema = SchemaFactory.createForClass(Category);

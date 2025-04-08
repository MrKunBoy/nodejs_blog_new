import { Category } from '@/modules/categories/schemas/category.schema';
import { Comment } from '@/modules/comments/schemas/comment.schema';
import { BaseSchema } from '@/modules/shared/base/base.schema';
import { PublicFile } from '@/modules/shared/upload-files/public-files.entity';
import { Tag } from '@/modules/tags/schemas/tag.schema';
import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

// Define the Post document type
export type PostDocument = HydratedDocument<Posts>;

@Schema({ timestamps: true, collection: 'posts' }) // Automatically adds createdAt and updatedAt fields
export class Posts extends BaseSchema {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	user: User;

	@Prop({ required: true }) // Make title required
	title: string;

	@Prop({ required: true }) // Make content required
	content: string;

	@Prop() // Excerpt is optional
	excerpt: string;

	@Prop({ required: true, unique: true }) // SEO-friendly slug
	slug: string;

	@Prop({ default: false }) // Published status, default false
	published: boolean;

	@Prop({ default: 0 }) // Default view count is 0
	views: number;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
	tags: Tag[] | string[] | ObjectId[];

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
	categories: Category[] | string[] | ObjectId[];

	@Prop({ type: PublicFile })
	@Type(() => PublicFile)
	image: PublicFile;
}

// Create the Post schema
const schema = SchemaFactory.createForClass(Posts);

schema.index({ slug: 1, _id: 1 });

export const PostSchema = schema;

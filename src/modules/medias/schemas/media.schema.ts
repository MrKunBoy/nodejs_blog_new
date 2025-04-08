import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Posts } from '@/modules/posts/schemas/post.schema';

// Define the Media document type
export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true }) // Automatically adds createdAt field
export class Media {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
	post: Posts;

	@Prop({ required: true }) // File path
	file_path: string;

	@Prop({ required: true }) // File type (image, video, etc.)
	file_type: string;
}

// Create the Media schema
export const MediaSchema = SchemaFactory.createForClass(Media);

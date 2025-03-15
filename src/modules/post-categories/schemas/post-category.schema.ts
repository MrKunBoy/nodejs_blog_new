import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from '@/modules/posts/schemas/post.schema';
import { Category } from '@/modules/categories/schemas/category.schema';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the PostCategory document type
export type PostCategoryDocument = HydratedDocument<PostCategory>;

@Schema()
export class PostCategory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name, required: true })
  post_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name, required: true })
  category_id: mongoose.Schema.Types.ObjectId;
}

// Create the PostCategory schema
export const PostCategorySchema = SchemaFactory.createForClass(PostCategory);

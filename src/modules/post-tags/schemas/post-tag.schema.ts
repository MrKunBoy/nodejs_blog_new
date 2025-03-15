import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from '@/modules/posts/schemas/post.schema';
import { Tag } from '@/modules/tags/schemas/tag.schema';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the PostTag document type
export type PostTagDocument = HydratedDocument<PostTag>;

@Schema()
export class PostTag {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name, required: true })
  post_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Tag.name, required: true })
  tag_id: mongoose.Schema.Types.ObjectId;
}

// Create the PostTag schema
export const PostTagSchema = SchemaFactory.createForClass(PostTag);

import { User } from '@/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

// Define the Post document type
export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Post {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true }) // Make title required
  title: string;

  @Prop({ required: true }) // Make content required
  content: string;

  @Prop() // Excerpt is optional
  excerpt?: string;

  @Prop({ required: true, unique: true }) // SEO-friendly slug
  slug: string;

  @Prop({ default: false }) // Published status, default false
  published: boolean;

  @Prop({ default: 0 }) // Default view count is 0
  views: number;
}

// Create the Post schema
export const PostSchema = SchemaFactory.createForClass(Post);


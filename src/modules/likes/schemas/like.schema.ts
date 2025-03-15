import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from '@/modules/posts/schemas/post.schema';
import { User } from '@/modules/users/schemas/user.schema';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the Like document type
export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true }) // Automatically adds createdAt field
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name, required: true })
  post_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user_id: mongoose.Schema.Types.ObjectId;
}

// Create the Like schema
export const LikeSchema = SchemaFactory.createForClass(Like);


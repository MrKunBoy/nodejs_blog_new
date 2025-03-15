import { User } from '@/modules/users/schemas/user.schema';
import { Post } from '@/modules/posts/schemas/post.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

// Define the Comment document type
export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name, required: true })
  post_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true }) // Make content required
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }) // Support nested comments
  parent_id?: mongoose.Schema.Types.ObjectId;
}

// Create the Comment schema
export const CommentSchema = SchemaFactory.createForClass(Comment);


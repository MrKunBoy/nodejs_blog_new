import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the Media document type
export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true }) // Automatically adds createdAt field
export class Media {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true }) // File path
  file_path: string;

  @Prop({ required: true }) // File type (image, video, etc.)
  file_type: string;
}

// Create the Media schema
export const MediaSchema = SchemaFactory.createForClass(Media);


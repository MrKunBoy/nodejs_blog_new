import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@/modules/users/schemas/user.schema';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the Notification document type
export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true }) // Automatically adds createdAt field
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true }) // Notification message
  message: string;

  @Prop({ default: false }) // Read status, default false
  is_read: boolean;
}

// Create the Notification schema
export const NotificationSchema = SchemaFactory.createForClass(Notification);


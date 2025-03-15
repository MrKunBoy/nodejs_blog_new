import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the Setting document type
export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true }) // Automatically adds createdAt field
export class Setting {
  @Prop({ required: true, unique: true }) // Unique setting key
  key: string;

  @Prop({ required: true }) // Setting value
  value: string;
}

// Create the Setting schema
export const SettingSchema = SchemaFactory.createForClass(Setting);


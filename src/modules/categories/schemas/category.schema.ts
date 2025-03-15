import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

// Define the Category document type
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Category {
  @Prop({ required: true, unique: true }) // Unique category name
  name: string;

  @Prop({ required: true, unique: true }) // SEO-friendly slug
  slug: string;
}

// Create the Category schema
export const CategorySchema = SchemaFactory.createForClass(Category);


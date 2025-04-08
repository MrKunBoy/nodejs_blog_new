import { BaseSchema } from '@/modules/shared/base/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define the Tag document type
export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Tag extends BaseSchema{
  @Prop({ required: true, unique: true }) // Unique tag name
  name: string;

  @Prop({ required: true, unique: true }) // SEO-friendly slug
  slug: string;
}

// Create the Tag schema
export const TagSchema = SchemaFactory.createForClass(Tag);


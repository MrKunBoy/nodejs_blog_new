import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Define the User document type
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class User {
  @Prop({ required: true }) // Make name required
  name: string;

  @Prop({ required: true, unique: true }) // Make email required and unique
  email: string;

  @Prop({ required: true }) // Make password required
  password: string;

  @Prop() // Phone is optional
  phone?: string;

  @Prop() // Address is optional
  address?: string;

  @Prop() // Image is optional
  image?: string;

  @Prop({ enum: ['ADMIN', 'EMPLOYEE', 'USER'], default: 'USER' }) // Corrected default value to 'USER'
  role: string;

  @Prop({ default: 'LOCAL' }) // Default account type
  accountType: string;

  @Prop({ default: true }) // Default isActive to true
  isActive: boolean;

  @Prop() // Code ID is optional
  codeId?: string;

  @Prop() // Code expiration date is optional
  codeExpired?: Date;
}

// Create the User schema
export const UserSchema = SchemaFactory.createForClass(User);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  _id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  passwordHash: string;
}

export type UserDocument = Document & User;

export const UserSchema = SchemaFactory.createForClass(User);

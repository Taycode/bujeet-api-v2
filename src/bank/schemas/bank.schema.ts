import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Bank {
  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  bankCode: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' })
  userId: mongoose.Schema.Types.ObjectId;
}

export type BankDocument = Bank & Document;

export const BankSchema = SchemaFactory.createForClass(Bank);

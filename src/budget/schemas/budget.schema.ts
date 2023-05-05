import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum BudgetStatus {
  inactive = 'inactive',
  active = 'active',
  completed = 'completed',
}

@Schema({ timestamps: true })
export class Budget {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    default: BudgetStatus.inactive,
    enum: BudgetStatus,
  })
  status: BudgetStatus;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: Number,
    required: true,
  })
  amount: number;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  balance: number;
}

export type BudgetDocument = Document & Budget;

export const BudgetSchema = SchemaFactory.createForClass(Budget);

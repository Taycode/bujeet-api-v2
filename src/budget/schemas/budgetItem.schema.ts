import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Budget } from './budget.schema';

export enum BudgetItemType {
  oneTime = 'one-time',
  daily = 'daily',
}

@Schema({ timestamps: true })
export class BudgetItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Budget.name,
    required: true,
  })
  budget: Budget | string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    type: String,
    required: true,
    enum: BudgetItemType,
  })
  type: BudgetItemType;

  @Prop({ required: false })
  date: Date;
}

export type BudgetItemDocument = BudgetItem & Document;

export const BudgetItemSchema = SchemaFactory.createForClass(BudgetItem);

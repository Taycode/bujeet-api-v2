import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Budget } from './budget.schema';

export enum BudgetItemType {
  recurring = 'recurring',
  non_recurring = 'non_recurring',
}

@Schema({ timestamps: true })
export class BudgetItem {
  @Prop({
    type: String,
    ref: Budget.name,
    required: true,
  })
  budgetId: string;

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
  date?: Date;
}

export type BudgetItemDocument = BudgetItem & Document;

export const BudgetItemSchema = SchemaFactory.createForClass(BudgetItem);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export enum BudgetStatus {
  incomplete = 'incomplete',
  inactive = 'inactive',
  active = 'active',
}

@Schema({ timestamps: true })
export class Budget {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: User | string;

  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    default: BudgetStatus.incomplete,
    enum: BudgetStatus,
  })
  status: BudgetStatus;

  @Prop({
    type: Number,
    required: false,
  })
  balance: number;

  @Prop({
    type: Number,
    required: true,
  })
  estimatedAmount: number;

  @Prop({
    type: Number,
    required: true,
  })
  calculatedAmount: number;
}

export type BudgetDocument = Document & Budget;

export const BudgetSchema = SchemaFactory.createForClass(Budget);

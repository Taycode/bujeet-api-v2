import {
  IsString,
  IsNumber,
  IsDate,
  ValidateNested,
  ArrayMinSize,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetItemType } from "../schemas/budgetItem.schema";

export class CreateBudgetItemDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @IsString()
  type: BudgetItemType;

  @IsDate()
  date: Date;
}

export class CreateBudgetDto {
  @IsString()
  name: string;

  @IsNumber()
  amount: number;

  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  items: CreateBudgetItemDto[];
}

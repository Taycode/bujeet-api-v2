import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BudgetItemType } from '../schemas/budgetItem.schema';
import { ApiProperty } from '@nestjs/swagger';

export class AddBudgetItemsDto {
  @ApiProperty({
    type: () => [CreateBudgetItemDto],
    description: 'Array of budget items to be added.',
  })
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  items: CreateBudgetItemDto[];
}

export class CreateBudgetItemDto {
  @ApiProperty({ description: 'Name of the budget item.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Amount of the budget item.' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Type of the budget item (daily or one-time).',
    enum: BudgetItemType,
  })
  @IsEnum(BudgetItemType)
  type: BudgetItemType;

  @ApiProperty({ description: 'Date of the budget item.' })
  @IsDate()
  date: Date;
}

export class CreateBudgetItemInputDto {
  name: string;
  amount: number;
  type: BudgetItemType;
  date?: Date;
  budget: string;
}

import { IsString } from 'class-validator';

export class PayForBudgetDto {
  @IsString()
  reference: string;
}

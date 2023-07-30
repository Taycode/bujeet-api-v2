import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBudgetDto {
  @IsString()
  @ApiProperty({ type: String, required: true, description: 'Name of budget' })
  name: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'Estimated amount',
  })
  estimatedAmount: number;
}

export class CreateBudgetInputDto {
  name: string;
  user: string;
  balance: number;
  estimatedAmount: number;
  calculatedAmount: number;
}

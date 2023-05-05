import { IsString } from 'class-validator';

export class CreateBankDto {
  @IsString()
  accountNumber: string;

  @IsString()
  bankCode: string;

  @IsString()
  accountName: string;

  @IsString()
  bankName: string;
}

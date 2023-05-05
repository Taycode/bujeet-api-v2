import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankRepository } from './bank.repository';
import { BankController } from './bank.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Bank, BankSchema } from "./schemas/bank.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bank.name,
        schema: BankSchema,
      },
    ]),
  ],
  controllers: [BankController],
  providers: [BankService, BankRepository],
  exports: [BankService],
})
export class BankModule {}

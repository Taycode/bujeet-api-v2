import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Budget, BudgetSchema } from './schemas/budget.schema';
import { BudgetRepository } from './repositories/budget.repository';
import { BudgetItemRepository } from './repositories/budgetItem.repository';
import { BankModule } from '../bank/bank.module';
import { BudgetItem, BudgetItemSchema } from './schemas/budgetItem.schema';
import { PaystackModule } from '../paystack/paystack.module';
import { BullModule } from '@nestjs/bull';
import { BudgetConsumer } from './budget.consumer';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Budget.name,
        schema: BudgetSchema,
      },
      {
        name: BudgetItem.name,
        schema: BudgetItemSchema,
      },
    ]),
    BankModule,
    PaystackModule,
    BullModule.registerQueue({
      name: 'budgets',
    }),
  ],
  controllers: [BudgetController],
  providers: [
    BudgetService,
    BudgetRepository,
    BudgetItemRepository,
    BudgetConsumer,
  ],
})
export class BudgetModule {}

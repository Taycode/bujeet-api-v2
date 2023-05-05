import { Injectable } from '@nestjs/common';
import { BudgetRepository } from './repositories/budget.repository';
import { BudgetItemRepository } from './repositories/budgetItem.repository';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { User } from '../user/schemas/user.schema';
import { BudgetItemType } from './schemas/budgetItem.schema';
import { Budget, BudgetStatus } from './schemas/budget.schema';
import { PaystackService } from '../paystack/paystack.service';
import { BankService } from '../bank/bank.service';
import { Bank } from '../bank/schemas/bank.schema';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BudgetService {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly budgetItemRepository: BudgetItemRepository,
    private readonly paystackService: PaystackService,
    private readonly bankService: BankService,
    @InjectQueue('budgets') private budgetQueue: Queue,
  ) {}
  async createBudget(payload: CreateBudgetDto, user: User) {
    const budget = await this.budgetRepository.create({
      userId: user._id,
      name: payload.name,
      amount: payload.amount,
    });
    const budgetItemPayload = payload.items.map((_) => {
      return { ..._, budgetId: budget._id };
    });
    const budgetItems = await this.budgetItemRepository.createMany([
      ...budgetItemPayload,
    ]);
    return { budget, budgetItems };
  }

  async fetchBudgets(user: User) {
    return this.budgetRepository.find({ userId: user._id })
  }

  async calculateBudget(budget: CreateBudgetDto) {
    const budgetAmount = budget.amount;
    const dailyExpense = budget.items.filter(
      (_) => _.type === BudgetItemType.recurring,
    );
    const oneTimeExpense = budget.items.filter(
      (_) => _.type === BudgetItemType.non_recurring,
    );
    let dailyExpenseAmount = dailyExpense.reduce(
      (prev, next) => prev + next.amount,
      0,
    );
    dailyExpenseAmount *= 30;
    const oneTimeExpenseAmount = oneTimeExpense.reduce(
      (prev, next) => prev + next.amount,
      0,
    );
    const totalAmount = oneTimeExpenseAmount + dailyExpenseAmount;
    const balance = budgetAmount - totalAmount;
    const canProceed = balance >= 0;
    return {
      planName: budget.name,
      expenseItemCount: budget.items.length,
      dailyExpenseItemCount: dailyExpense.length,
      oneTimeExpenseItemCount: oneTimeExpense.length,
      budgetAmount,
      expenses: totalAmount,
      balance,
      canProceed,
    };
  }

  async confirmBudgetPayment(budgetId: string, reference: string) {
    const transaction = await this.paystackService.verifyTransaction(reference);
    if (transaction.data.status === 'success') {
      return this.budgetRepository.findOneAndUpdate(
        { _id: budgetId },
        { status: BudgetStatus.active },
      );
    }
    throw new Error('Payment was not successful');
  }

  async fetchBudgetsForProcessing() {
    // fetch all budgets
    const budgets = await this.budgetRepository.find({});
    budgets.map((_) => this.budgetQueue.add('budgets', _));
  }

  async processEachBudget(budget: Budget, job: Job) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all re-occurring budgets
    const dailyExpenses = await this.budgetItemRepository.find({
      budgetId: budget._id,
      type: BudgetItemType.recurring,
    });

    await job.log(`Daily Expenses fetched, count: ${dailyExpenses.length}`);

    const oneTimeExpenses = await this.budgetItemRepository.find({
      budgetId: budget._id,
      type: BudgetItemType.non_recurring,
      date: { $gte: today, $lt: tomorrow },
    });

    await job.log(
      `One time Expenses fetched, count: ${oneTimeExpenses.length}`,
    );

    const expenses = [...dailyExpenses, ...oneTimeExpenses];
    const expensesAmount = expenses.reduce(
      (prev, next) => prev + next.amount,
      0,
    );

    await job.log(`Total amount to reinburse: ${expensesAmount}`);

    const userBank = await this.bankService.fetchUserBankWithUserId(
      budget.userId,
    );

    await job.log(`User bank fetched`);

    if (!userBank) throw new Error('This user has no bank');

    await job.log(`Trying to pay into account`);

    // Pay money to bank
    await this.payToBank(expensesAmount, userBank);
  }

  async payToBank(amount: number, bank: Bank) {
    // Create Recipient
    const createRecipient = await this.paystackService.createRecipient({
      type: 'NUBAN',
      name: bank.accountName,
      account_number: bank.accountNumber,
      bank_code: bank.bankCode,
      currency: 'NGN',
    });

    // Initiate Transfer
    await this.paystackService.transfer({
      source: 'balance',
      reason: 'Budget',
      amount,
      recipient: createRecipient.data.recipient_code,
    });

    // toDo: Debit amount from wallet
  }
}

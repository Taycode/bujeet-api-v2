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
import {
  AddBudgetItemsDto,
  CreateBudgetItemInputDto,
} from './dto/add-budget-items.dto';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  BudgetItemsCreationError,
  BudgetNotFoundException,
} from './exceptions/budget.exception';

@Injectable()
export class BudgetService {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly budgetItemRepository: BudgetItemRepository,
    private readonly paystackService: PaystackService,
    private readonly bankService: BankService,
    @InjectQueue('budgets') private budgetQueue: Queue,
    @InjectConnection() private readonly connection: Connection,
  ) {}
  async createBudget(payload: CreateBudgetDto, user: User) {
    return this.budgetRepository.create({
      user: user._id,
      name: payload.name,
      balance: payload.estimatedAmount,
      estimatedAmount: payload.estimatedAmount,
      calculatedAmount: payload.estimatedAmount,
    });
  }

  async addItemsToBudget(payload: AddBudgetItemsDto, budget: Budget) {
    const budgetItemsPayload: CreateBudgetItemInputDto[] = payload.items.map(
      (eachItem) => {
        return { ...eachItem, budget: budget._id };
      },
    );
    const session = await this.connection.startSession();
    try {
      await this.budgetItemRepository.createMany(budgetItemsPayload, session);
      await this.budgetItemRepository.transactionalFindOneAndUpdate(
        {
          budget: budget._id,
        },
        { status: BudgetStatus.inactive },
        session,
      );
    } catch (e) {
      throw new BudgetItemsCreationError();
    } finally {
      await session.endSession();
    }
  }

  async fetchUserBudgetOrFail(budgetId: string, user: User) {
    const budget = await this.budgetRepository.findOneWithUserPopulated({
      _id: budgetId,
      user,
    });
    if (budget) return budget;
    throw new BudgetNotFoundException();
  }

  async fetchBudgets(user: User) {
    return this.budgetRepository.find({ user: user._id });
  }

  async calculateBudget(
    budget: Budget,
    budgetItems: AddBudgetItemsDto['items'],
  ) {
    const budgetAmount = budget.estimatedAmount;
    const dailyExpense = budgetItems.filter(
      (_) => _.type === BudgetItemType.daily,
    );
    const oneTimeExpense = budgetItems.filter(
      (_) => _.type === BudgetItemType.oneTime,
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
      expenseItemCount: budgetItems.length,
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
      type: BudgetItemType.daily,
    });

    await job.log(`Daily Expenses fetched, count: ${dailyExpenses.length}`);

    const oneTimeExpenses = await this.budgetItemRepository.find({
      budgetId: budget._id,
      type: BudgetItemType.oneTime,
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
      budget.user as string,
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

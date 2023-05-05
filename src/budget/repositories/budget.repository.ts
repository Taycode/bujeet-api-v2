import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Budget, BudgetDocument } from '../schemas/budget.schema';

export class BudgetRepository extends BaseRepository<BudgetDocument> {
  constructor(@InjectModel(Budget.name) budgetModel: Model<BudgetDocument>) {
    super(budgetModel);
  }

  async create<T>(payload: T): Promise<BudgetDocument> {
    return super.create(payload);
  }
}

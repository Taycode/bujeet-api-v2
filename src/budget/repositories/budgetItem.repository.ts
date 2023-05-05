import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BudgetItem, BudgetItemDocument } from '../schemas/budgetItem.schema';

export class BudgetItemRepository extends BaseRepository<BudgetItemDocument> {
  constructor(
    @InjectModel(BudgetItem.name) budgetItemModel: Model<BudgetItemDocument>,
  ) {
    super(budgetItemModel);
  }

  async create<T>(payload: T): Promise<BudgetItemDocument> {
    return super.create(payload);
  }

  async createMany(payload): Promise<BudgetItemDocument[]> {
    return super.create([...payload]);
  }
}

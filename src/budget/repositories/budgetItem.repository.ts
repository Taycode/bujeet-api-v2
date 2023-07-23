import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BudgetItem, BudgetItemDocument } from '../schemas/budgetItem.schema';
import { ClientSession } from 'mongodb';
import { CreateBudgetItemInputDto } from '../dto/add-budget-items.dto';

export class BudgetItemRepository extends BaseRepository<BudgetItemDocument> {
  constructor(
    @InjectModel(BudgetItem.name) budgetItemModel: Model<BudgetItemDocument>,
  ) {
    super(budgetItemModel);
  }
  async createMany(
    payload: CreateBudgetItemInputDto[],
    session: ClientSession,
  ) {
    return super.create([...payload], session);
  }
}

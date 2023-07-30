import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from '../../../common/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Budget, BudgetDocument } from '../schemas/budget.schema';
import { CreateBudgetInputDto } from '../dto/create-budget.dto';
import { User } from '../../user/schemas/user.schema';
import {
  BudgetWithUserAsId,
  BudgetWithUserAsUser,
} from '../entities/budget.entity';

export class BudgetRepository extends BaseRepository<BudgetDocument> {
  constructor(@InjectModel(Budget.name) budgetModel: Model<BudgetDocument>) {
    super(budgetModel);
  }

  async create(payload: CreateBudgetInputDto): Promise<BudgetDocument> {
    return super.create(payload);
  }

  async findOneWithUserPopulated(
    query: FilterQuery<BudgetDocument>,
    projections?: any | null,
  ): Promise<BudgetWithUserAsUser | null> {
    return (await this.findOneWithPopulation(
      query,
      'user',
      projections,
    )) as BudgetWithUserAsUser;
  }

  async findOne(
    query: FilterQuery<BudgetDocument>,
    projections?: any | null,
  ): Promise<BudgetWithUserAsId | null> {
    return (await super.findOne(query, projections)) as BudgetWithUserAsId;
  }
}

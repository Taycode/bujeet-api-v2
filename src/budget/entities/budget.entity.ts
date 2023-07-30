import { BudgetDocument } from '../schemas/budget.schema';
import { User } from '../../user/schemas/user.schema';

export type BudgetWithUserAsUser = BudgetDocument & {
  user: User;
};

export type BudgetWithUserAsId = BudgetDocument & {
  user: string;
};

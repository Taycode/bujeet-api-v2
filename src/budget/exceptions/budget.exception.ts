export class BudgetItemsCreationError extends Error {
  constructor() {
    super('Could not create budget items, kindly try again');
    this.name = 'BudgetItemsCreationError';
  }
}

export class BudgetNotFoundException extends Error {
  constructor() {
    super('Budget not found');
    this.name = 'BudgetNotFoundException';
  }
}

export class UserAlreadyHasABudgetException extends Error {
  constructor() {
    super('This user already has a budget');
    this.name = 'UserAlreadyHasABudgetException';
  }
}

export class BudgetAlreadyFilledException extends Error {
  constructor() {
    super('This budget has already been filled with budget items');
    this.name = 'BudgetAlreadyFilledException';
  }
}

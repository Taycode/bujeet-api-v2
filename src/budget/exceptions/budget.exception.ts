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

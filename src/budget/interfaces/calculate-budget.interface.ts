export interface CalculateBudgetInterface {
  planName: string;
  expenseItemCount: number;
  dailyExpenseItemCount: number;
  oneTimeExpenseItemCount: number;
  budgetAmount: number;
  totalExpenses: number;
  balance: number;
  canProceed: boolean;
}

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Budget } from './schemas/budget.schema';
import { BudgetService } from './budget.service';

@Processor('budgets')
export class BudgetConsumer {
  constructor(private readonly budgetService: BudgetService) {}
  @Process({ name: 'budgets', concurrency: 5 })
  async transcode(job: Job<Budget>) {
    const budget = job.data;
    try {
      await this.budgetService.processEachBudget(budget, job);
    } catch (e) {
      // await job.log(`Error: ${e.message}`);
    }
  }
}

import {
  Body,
  Controller, Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { ICustomRequest } from '../../common/types/custom-request.type';
import { JWTAuthGuard } from '../user/guard/jwt.guard';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { PayForBudgetDto } from './dto/pay-for-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create')
  @UseGuards(JWTAuthGuard)
  async createBudget(@Req() req: ICustomRequest) {
    const payload: CreateBudgetDto = req.body;
    const { user } = req;
    const response = await this.budgetService.createBudget(payload, user);
    return {
      status: true,
      message: 'Budget created successfully',
      data: response,
    };
  }

  @Post('calculate')
  @UseGuards(JWTAuthGuard)
  async calculateBudget(@Body() payload: CreateBudgetDto) {
    const response = await this.budgetService.calculateBudget(payload);
    return {
      status: true,
      message: 'Budget calculated successfully',
      data: response,
    };
  }

  @Post('pay/:budgetId')
  @UseGuards(JWTAuthGuard)
  async payForBudget(
    @Req() req: ICustomRequest,
    @Param('budgetId') budgetId: string,
  ) {
    const payload: PayForBudgetDto = req.body;
    const { reference } = payload;
    const updatedBudget = await this.budgetService.confirmBudgetPayment(
      budgetId,
      reference,
    );
    if (!updatedBudget)
      throw new HttpException('Budget does not exist.', HttpStatus.BAD_REQUEST);
    return {
      status: true,
      message: 'Budget payment successful',
      data: updatedBudget,
    };
  }

  @Post('trigger')
  async triggerBudgetPayment() {
    return this.budgetService.fetchBudgetsForProcessing();
  }

  @Get('fetch')
  @UseGuards(JWTAuthGuard)
  async fetchBudgets(@Req() req: ICustomRequest) {
    const { user } = req;
    const budgets = await this.budgetService.fetchBudgets(user);
    return {
      status: true,
      message: 'Budgets fetched',
      data: budgets,
    };
  }
}

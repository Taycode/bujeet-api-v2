import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ICustomRequest } from '../../common/types/custom-request.type';
import { JWTAuthGuard } from '../user/guard/jwt.guard';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { AddBudgetItemsDto } from './dto/add-budget-items.dto';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CalculateBudgetDto } from './dto/calculate-budget.dto';
import { CalculateBudgetInterface } from './interfaces/calculate-budget.interface';
import { Budget } from './schemas/budget.schema';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('create')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  async createBudget(
    @Req() req: ICustomRequest,
    @Body() payload: CreateBudgetDto,
  ): Promise<ResponseInterface<Budget>> {
    const { user } = req;
    const response = await this.budgetService.createBudget(payload, user);
    return {
      message: 'Budget created successfully',
      data: response,
    };
  }

  @Post('/:budgetId/add-budget-items')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  async addBudgetItems(
    @Req() req: ICustomRequest,
    @Body() payload: AddBudgetItemsDto,
    @Param('budgetId') budgetId: string,
  ): Promise<ResponseInterface> {
    const { user } = req;
    const budget = await this.budgetService.fetchUserBudgetWithIdOrFail(
      budgetId,
      user,
    );
    await this.budgetService.addItemsToBudget(payload, budget);
    return {
      message: 'Budget items added successfully',
    };
  }

  @Post('/:budgetId/calculate')
  @UseGuards(JWTAuthGuard)
  async calculateBudget(
    @Req() req: ICustomRequest,
    @Body() payload: CalculateBudgetDto,
    @Param('budgetId') budgetId: string,
  ): Promise<ResponseInterface<CalculateBudgetInterface>> {
    const { user } = req;
    const budget = await this.budgetService.fetchUserBudgetWithIdOrFail(
      budgetId,
      user,
    );
    const response = await this.budgetService.calculateBudget(
      budget,
      payload.items,
    );
    return {
      message: 'Budget calculated successfully',
      data: response,
    };
  }

  // @Post('pay/:budgetId')
  // @UseGuards(JWTAuthGuard)
  // async payForBudget(
  //   @Req() req: ICustomRequest,
  //   @Param('budgetId') budgetId: string,
  // ) {
  //   const payload: PayForBudgetDto = req.body;
  //   const { reference } = payload;
  //   const updatedBudget = await this.budgetService.confirmBudgetPayment(
  //     budgetId,
  //     reference,
  //   );
  //   if (!updatedBudget)
  //     throw new HttpException('Budget does not exist.', HttpStatus.BAD_REQUEST);
  //   return {
  //     status: true,
  //     message: 'Budget payment successful',
  //     data: updatedBudget,
  //   };
  // }
  //
  // @Post('trigger')
  // async triggerBudgetPayment() {
  //   return this.budgetService.fetchBudgetsForProcessing();
  // }

  @Get('fetch-budget')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  async fetchUserBudget(@Req() req: ICustomRequest) {
    const { user } = req;
    const budget = await this.budgetService.fetchUserBudget(user);
    return {
      message: 'Budgets fetched',
      data: budget,
    };
  }
}

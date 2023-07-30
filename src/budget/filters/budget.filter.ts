import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as budgetExceptions from '../exceptions/budget.exception';

@Catch()
export class BudgetExceptionFilter extends BaseExceptionFilter {
  errors = Object.values(budgetExceptions);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (this.errors.some((eachError) => exception instanceof eachError)) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message,
      });
    } else {
      super.catch(exception, host);
    }
  }
}

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { IncorrectCredentialsException } from '../exceptions/user.exception';

@Catch()
export class UserExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof IncorrectCredentialsException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message,
      });
    }
  }
}

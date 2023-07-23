import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { ICustomRequest } from '../../common/types/custom-request.type';
import { JWTAuthGuard } from './guard/jwt.guard';
import { ResponseInterface } from '../../common/interfaces/response.interface';
import { CreateUserResponse } from './interface/create-user.interface';
import { LoginUserDto } from './dto/authenticate-user.dto';
import { AuthenticateUserResponse } from './interface/authenticate-user.interface';
import { UserExceptionFilter } from './filters/user.filter';
import { UserWithoutPassword } from './types/authenticate-user.type';

@Controller('user')
@UseFilters(UserExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async loginUser(
    @Body() payload: LoginUserDto,
  ): Promise<ResponseInterface<AuthenticateUserResponse>> {
    const authToken = await this.userService.authenticateUser(payload);
    return {
      message: 'Authentication successful',
      data: {
        token: authToken,
      },
    };
  }

  @Post('/register')
  async registerUser(
    @Body() payload: RegisterUserDto,
  ): Promise<ResponseInterface<CreateUserResponse>> {
    const newUser = await this.userService.createUser(payload);
    return {
      message: 'Registration successful',
      data: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    };
  }

  @Get('/fetch-me')
  @UseGuards(JWTAuthGuard)
  async fetchLoggedInUser(
    @Req() req: ICustomRequest,
  ): Promise<ResponseInterface<UserWithoutPassword>> {
    const { user } = req;
    return {
      message: 'User fetched',
      data: user,
    };
  }
}

import { UserService } from './user.service';
import {
  Body,
  Controller, Get,
  HttpException,
  HttpStatus,
  Post,
  Req, UseGuards
} from "@nestjs/common";
import { UserRepository } from './user.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './schemas/user.schema';
import { ICustomRequest } from '../../common/types/custom-request.type';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTAuthGuard } from "./guard/jwt.guard";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async loginUser(@Body() payload: any) {
    const { email, password } = payload;
    if (!email) {
      throw new HttpException(
        'Email is required/malformed',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({ email });

    if (user) {
      const validatePassword = await this.userService.comparePassword(
        password,
        user.passwordHash,
      );
      if (validatePassword) {
        const token = await this.jwtService.signAsync(
          {
            email: user.email,
            _id: user._id,
          },
          { secret: this.configService.get('SECRET') },
        );
        return {
          status: true,
          message: 'Login successful',
          data: { token },
        };
      }
    }
    throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  }

  @Post('/register')
  async registerUser(@Body() payload: RegisterUserDto) {
    const { email, password } = payload;

    const oldUser = await this.userRepository.findOne({ email });

    if (oldUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await this.userService.generatePassword(password);

    const createUserPayload: Omit<User, '_id'> = {
      email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    const newUser = await this.userRepository.create(createUserPayload);

    return {
      status: true,
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
  async fetchLoggedInUser(@Req() req: ICustomRequest) {
    const { user } = req;
    return {
      status: true,
      message: 'User fetched',
      data: user,
    };
  }
}

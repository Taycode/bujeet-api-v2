import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { CreateUserInputDto, RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/authenticate-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserTokenPayload } from './types/authenticate-user.type';
import { IncorrectCredentialsException } from './exceptions/user.exception';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async comparePassword(textPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(textPassword, hash);
  }

  async generateUserAuthToken(user: User) {
    const userPayload: UserTokenPayload = {
      email: user.email,
      _id: user._id,
    };
    return this.jwtService.signAsync(
      { ...userPayload },
      { secret: this.configService.get('SECRET') },
    );
  }

  async generatePassword(textPassword: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(textPassword, salt);
  }

  async findUserById(userId: string) {
    return this.userRepository.findOne({ _id: userId });
  }

  async createUser(payload: RegisterUserDto) {
    const { email, password } = payload;
    const oldUser = await this.userRepository.findOne({ email });

    if (oldUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await this.generatePassword(password);

    const createUserPayload: CreateUserInputDto = {
      email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    return this.userRepository.create(createUserPayload);
  }

  async authenticateUser(payload: LoginUserDto) {
    const { email, password } = payload;
    const user = await this.userRepository.findOne({ email });
    if (user) {
      const passwordMatches = await this.comparePassword(
        password,
        user.passwordHash,
      );
      if (passwordMatches) return this.generateUserAuthToken(user);
    }
    throw new IncorrectCredentialsException();
  }
}

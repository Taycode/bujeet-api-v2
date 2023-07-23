import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';
import { ConfigService } from '@nestjs/config';
import { omit } from 'lodash';
import { UserWithoutPassword } from '../types/authenticate-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserById(payload._id);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return omit(user, 'passwordHash') as UserWithoutPassword;
  }
}

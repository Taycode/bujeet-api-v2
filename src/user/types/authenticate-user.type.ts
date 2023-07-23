import { User } from '../schemas/user.schema';

export type UserTokenPayload = {
  email: string;
  _id: string;
};

export type UserWithoutPassword = Omit<User, 'passwordHash'>;

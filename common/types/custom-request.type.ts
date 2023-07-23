import { Request } from 'express';
import { UserWithoutPassword } from '../../src/user/types/authenticate-user.type';

export type ICustomRequest = Request & { user: UserWithoutPassword };

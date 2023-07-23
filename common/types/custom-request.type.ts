import { Request } from 'express';
import { User } from '../../src/user/schemas/user.schema';

export type ICustomRequest = Request & { user: User };

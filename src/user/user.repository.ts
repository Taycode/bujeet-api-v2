import { Model } from 'mongoose';
import { BaseRepository } from '../../common/base.repository';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) mandateModel: Model<UserDocument>) {
    super(mandateModel);
  }

  async create<T>(payload: T): Promise<UserDocument> {
    return super.create(payload);
  }
}

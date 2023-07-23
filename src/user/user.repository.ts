import { Model } from 'mongoose';
import { BaseRepository } from '../../common/base.repository';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInputDto } from './dto/register-user.dto';

export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) mandateModel: Model<UserDocument>) {
    super(mandateModel);
  }

  async create(payload: CreateUserInputDto): Promise<UserDocument> {
    return super.model.create(payload);
  }
}

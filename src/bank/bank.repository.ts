import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Bank, BankDocument } from './schemas/bank.schema';
import { BaseRepository } from '../../common/base.repository';

export class BankRepository extends BaseRepository<BankDocument> {
  constructor(@InjectModel(Bank.name) bankModel: Model<BankDocument>) {
    super(bankModel);
  }

  async create<T>(payload: T): Promise<BankDocument> {
    return super.create(payload);
  }
}

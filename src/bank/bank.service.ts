import { Injectable } from '@nestjs/common';
import { BankRepository } from './bank.repository';
import { User } from '../user/schemas/user.schema';
import { CreateBankDto } from './dto/create-bank.dto';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async createBank(payload: CreateBankDto, user: User) {
    return this.bankRepository.create({ ...payload, userId: user._id });
  }

  async fetchUserBank(user: User) {
    return this.bankRepository.findOne({ userId: user._id });
  }

  async fetchUserBankWithUserId(userId: string) {
    return this.bankRepository.findOne({ userId });
  }
}

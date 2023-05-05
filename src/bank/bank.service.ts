import { Injectable } from '@nestjs/common';
import { BankRepository } from './bank.repository';
import { User } from '../user/schemas/user.schema';
import { CreateBankDto } from './dto/create-bank.dto';
import mongoose from 'mongoose';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async createBank(payload: CreateBankDto, user: User) {
    return this.bankRepository.create({ ...payload, userId: user._id });
  }

  async fetchUserBank(user: User) {
    return this.bankRepository.findOne({ userId: user._id });
  }

  async fetchUserBankWithUserId(userId: mongoose.Schema.Types.ObjectId) {
    return this.bankRepository.findOne({ userId });
  }
}

import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async comparePassword(textPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(textPassword, hash);
  }

  async generatePassword(textPassword: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(textPassword, salt);
  }

  async findUserById(userId: string) {
    return this.userRepository.findOne({ _id: userId });
  }
}

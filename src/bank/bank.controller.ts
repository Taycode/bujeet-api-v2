import { BankService } from './bank.service';
import { ICustomRequest } from '../../common/types/custom-request.type';
import { CreateBankDto } from './dto/create-bank.dto';
import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "../user/guard/jwt.guard";

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post('/create')
  @UseGuards(JWTAuthGuard)
  async createBank(@Req() req: ICustomRequest) {
    const { user } = req;
    const payload: CreateBankDto = req.body;
    const createdBank = await this.bankService.createBank(payload, user);
    return {
      status: true,
      message: 'Bank created successfully',
      data: createdBank,
    };
  }

  @Get('/fetch')
  @UseGuards(JWTAuthGuard)
  async fetchUserBank(@Req() req: ICustomRequest) {
    const { user } = req;
    const bank = await this.bankService.fetchUserBank(user);
    return {
      status: true,
      message: 'Bank fetched successfully',
      data: bank,
    };
  }
}

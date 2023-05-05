import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVerifyTransaction } from './interface/verify-transaction.interface';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { ICreateRecipient } from './interface/create-recipient.interface';
import { TransferDto } from './dto/transfer.dto';
import { ITransfer } from './interface/transfer.interface';

@Injectable()
export class PaystackService {
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET');
    this.baseUrl = this.configService.get<string>('PAYSTACK_BASE_URL');
  }

  async verifyTransaction(reference: string): Promise<IVerifyTransaction> {
    const url = `${this.baseUrl}/transaction/verify/${reference}`;
    const headers = { Authorization: `Bearer ${this.secretKey}` };
    return new Promise((resolve, reject) => {
      this.httpService.get(url, { headers }).subscribe({
        next: (res) => resolve(res.data),
        error: (err) => reject(err.response.data),
      });
    });
  }

  async createRecipient(
    payload: CreateRecipientDto,
  ): Promise<ICreateRecipient> {
    const url = `${this.baseUrl}/transferrecipient`;
    const headers = { Authorization: `Bearer ${this.secretKey}` };
    return new Promise((resolve, reject) => {
      this.httpService.post(url, payload, { headers }).subscribe({
        next: (res) => resolve(res.data),
        error: (err) => reject(err.response.data),
      });
    });
  }

  async transfer(payload: TransferDto): Promise<ITransfer> {
    const url = `${this.baseUrl}/transfer`;
    const headers = { Authorization: `Bearer ${this.secretKey}` };
    return new Promise((resolve, reject) => {
      this.httpService.post(url, payload, { headers }).subscribe({
        next: (res) => resolve(res.data),
        error: (err) => reject(err.response.data),
      });
    });
  }
}

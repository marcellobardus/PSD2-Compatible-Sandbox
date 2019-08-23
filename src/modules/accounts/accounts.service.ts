import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { ACCOUNTS_SCHEMA_PROVIDER } from '../../utils/constants';

import { AccountInterface } from './account.interface';

@Injectable()
export class AccountsService {
  constructor(
    @Inject(ACCOUNTS_SCHEMA_PROVIDER)
    private readonly accountModel: Model<AccountInterface>,
  ) {}

  async create(account: {
    accountID: number;
    currency: string;
    accountNumber: string;
    accountTypeDescription: string;
    accountTypeCode: string;
    accountTypeName: string;
    accountNameClient: string;
  }) {
    await new this.accountModel(account).save();
  }

  async getAll(): Promise<AccountInterface[]> {
    return this.accountModel.find({});
  }
}

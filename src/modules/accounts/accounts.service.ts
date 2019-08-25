import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { ACCOUNTS_SCHEMA_PROVIDER } from '../../utils/constants';

import { AccountInterface, Access } from './account.interface';

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

  async getAccountByID(accountID: number): Promise<AccountInterface> {
    return await this.accountModel.findOne({ accountID });
  }

  async updateAccountAccesses(accountID: number, newAccesses: Access) {
    await this.accountModel.updateOne(
      { accountID },
      {
        $set: {
          accesses: newAccesses,
        },
      },
    );
  }

  async setApplicationAccountAPIKey(
    accountID: number,
    appID: string,
    apiKey: string,
  ) {
    const key = 'accesses.' + appID;
    await this.accountModel.updateOne(
      { accountID },
      {
        $set: {
          [key]: { apiKey },
        },
      },
    );
  }

  async setApplicationAccountTmpKey(
    accountID: number,
    appID: string,
    tmpCode: string,
  ) {
    const key = 'accesses.' + appID;
    await this.accountModel.updateOne(
      { accountID },
      {
        $set: {
          [key]: { APIKeyClaimTmpCode: tmpCode },
        },
      },
    );
  }
}

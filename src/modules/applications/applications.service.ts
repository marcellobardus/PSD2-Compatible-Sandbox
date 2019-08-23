import { Injectable, Inject } from '@nestjs/common';
import { APPLICATION_SCHEMA_PROVIDER } from 'src/utils/constants';
import { Model } from 'mongoose';
import { ApplicationInterface } from './application.interface';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(APPLICATION_SCHEMA_PROVIDER)
    private readonly applicationModel: Model<ApplicationInterface>,
  ) {}

  async register(application: {
    appName: string;
    appDescription: string;
    appID: string;
    pubkey: string;
  }) {
    await new this.applicationModel(application).save();
  }

  async getAll(): Promise<ApplicationInterface[]> {
    return await this.applicationModel.find({});
  }
}

import { Document } from 'mongoose';

export interface ApplicationInterface extends Document {
  readonly appName: string;
  readonly appDescription: string;
  readonly appID: string;
  readonly hasAccessToAccountsIDs: number[];
}

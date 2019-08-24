import { Document } from 'mongoose';

export interface ApplicationInterface extends Document {
  readonly appName: string;
  readonly appDescription: string;
  readonly appID: string;
  readonly hasAccessToAccountsIDs: number[];
  readonly pubkey: string;

  readonly APIKeyClaimTmpCode: string;

  readonly APIKey: string;
}

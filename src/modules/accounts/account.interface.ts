import { Document } from 'mongoose';

export enum AccessType {
  PaymentInitiation = 'PaymentInitiation',
  AccountInformation = 'AccountInformation',
  PaymentInitiationAndAccountInformation = 'PaymentInitiationAndAccountInformation',
}

export interface Access {
  [appID: string]: {
    authorizationDate: number;
    accessType: AccessType;
    apiKey: string | null;
    APIKeyClaimTmpCode: string;
  };
}

export interface AccountInterface extends Document {
  readonly accountID: number;

  readonly currency: string;

  readonly bookingBalance: number;
  readonly availableBalance: number;

  readonly accountNumber: string;

  readonly accountTypeDescription: string;
  readonly accountTypeCode: string;
  readonly accountTypeName: string;

  readonly accountNameClient: string;

  // Internal properties

  accesses: Access;
}

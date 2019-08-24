import { Document } from 'mongoose';

export interface CustomerInterface extends Document {
  readonly name: string;
  readonly surname: string;
  readonly address: string;

  readonly passwordHash: string;

  readonly clientID: string;
  readonly accountsIds: number[];

  readonly session: string;
  readonly sessionExpirationTime: number;
}

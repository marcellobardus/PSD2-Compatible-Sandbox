import { ApiModelProperty } from '@nestjs/swagger';
import { AccessType } from './account.interface';

interface Access {
  [appID: string]: {
    authorizationDate: number;
    accessType: AccessType;
  };
}

class Account {
  @ApiModelProperty()
  readonly accountID: number;

  @ApiModelProperty()
  readonly currency: string;

  @ApiModelProperty()
  readonly bookingBalance: number;

  @ApiModelProperty()
  readonly availableBalance: number;

  @ApiModelProperty()
  readonly accountNumber: string;

  @ApiModelProperty()
  readonly accountTypeDescription: string;

  @ApiModelProperty()
  readonly accountTypeCode: string;

  @ApiModelProperty()
  readonly accountTypeName: string;

  @ApiModelProperty()
  readonly accountNameClient: string;

  // Internal properties

  @ApiModelProperty({
    example: {
      appID_1: {
        authorizationDate: 15683436,
        accessType: 'AccountInformation',
      },
      appID_2: { authorizationDate: 15683683, accessType: 'PaymentInitiation' },
      any_other_application: {
        authorizationDate: 15683683,
        accessType: 'PaymentInitiation',
      },
    },
  })
  readonly accesses: Access;
}

export class GetCustomerAccountsDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty({ type: [Account] })
  readonly accounts: Account[];
}

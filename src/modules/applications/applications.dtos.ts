import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AccessType } from '../accounts/account.interface';

export class ApplicationSignupDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly appName: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly appDescription: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly pubkey: string;
}

export class AuthorizeApplicationAsCustomerDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly appID: string;

  @ApiModelProperty({
    enum: [
      'PaymentInitiation',
      'AccountInformation',
      'PaymentInitiationAndAccountInformation',
    ],
  })
  @IsNotEmpty()
  readonly accessType: AccessType;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly accountID: number;
}

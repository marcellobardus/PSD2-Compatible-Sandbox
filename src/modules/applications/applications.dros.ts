import { ApiModelProperty } from '@nestjs/swagger';

export class ApplicationSignupDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly appID: string;
}

export class AuthorizeApplicationAsCustomerDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly tmpCode: string;

  @ApiModelProperty()
  readonly accountID: number;
}

export class ClaimAPIKeyDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly apiKey: string;

  @ApiModelProperty()
  readonly accountID: number;
}

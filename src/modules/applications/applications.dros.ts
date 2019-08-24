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
}

export class ClaimAPIKeyDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly apiKey: string;
}

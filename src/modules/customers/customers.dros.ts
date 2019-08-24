import { ApiModelProperty } from '@nestjs/swagger';

export class CustomerRegisteredDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly customerID: string;
}

export class CustomerLoginDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly session: string;

  @ApiModelProperty()
  readonly expirationTime: number;
}

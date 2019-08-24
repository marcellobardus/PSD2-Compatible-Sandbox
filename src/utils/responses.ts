import { ApiModelProperty } from '@nestjs/swagger';

export class AuthorizationError {
  @ApiModelProperty()
  readonly code: number = 401;

  @ApiModelProperty()
  readonly error: boolean = true;

  @ApiModelProperty()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class PayloadError {
  @ApiModelProperty()
  readonly code = 400;

  @ApiModelProperty()
  readonly error = true;

  @ApiModelProperty()
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class NoErrorResponse {
  @ApiModelProperty()
  readonly error: boolean;
}

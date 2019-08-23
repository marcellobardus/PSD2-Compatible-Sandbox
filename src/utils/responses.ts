import { ApiModelProperty } from '@nestjs/swagger';

export class AuthorizationError {
  @ApiModelProperty()
  readonly code = 401;

  @ApiModelProperty()
  readonly error = true;

  constructor(private readonly message: string) {}
}

export class PayloadError {
  @ApiModelProperty()
  readonly code = 400;

  @ApiModelProperty()
  readonly error = true;

  constructor(private readonly message: string) {}
}

export class NoErrorResponse {
  @ApiModelProperty()
  readonly error: boolean;
}

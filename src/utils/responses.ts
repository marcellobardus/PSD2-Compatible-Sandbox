import { ApiModelProperty } from '@nestjs/swagger';

export class AuthorizationError {
  @ApiModelProperty()
  readonly code = 401;

  @ApiModelProperty()
  readonly error = true;

  constructor(private readonly message: string) {}
}

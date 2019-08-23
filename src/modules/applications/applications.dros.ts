import { ApiModelProperty } from '@nestjs/swagger';

export class ApplicationSignupDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly appID: string;
}

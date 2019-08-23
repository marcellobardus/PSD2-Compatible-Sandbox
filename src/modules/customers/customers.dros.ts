import { ApiModelProperty } from '@nestjs/swagger';

export class CustomerRegisteredDro {
  @ApiModelProperty()
  readonly error: boolean;

  @ApiModelProperty()
  readonly customerID: string;
}

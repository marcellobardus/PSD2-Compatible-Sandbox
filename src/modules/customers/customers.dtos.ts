import { ApiModelProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class RegisterCustomerDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly surname: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly address: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly passwordHash: string;
}

export class LoginCustomerDto {
  @ApiModelProperty()
  @IsNotEmpty()
  readonly clientID: string;

  @ApiModelProperty()
  @IsNotEmpty()
  readonly passwordHash: string;
}

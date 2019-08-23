import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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

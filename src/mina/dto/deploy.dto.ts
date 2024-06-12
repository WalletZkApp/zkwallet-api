import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class DeployDto {
  @ApiProperty()
  @IsNotEmpty()
  sharedkey: string;

  @ApiProperty()
  @IsNotEmpty()
  network: string;

  @ApiProperty()
  @IsOptional()
  zkAppAddress: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateKeyDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;
}

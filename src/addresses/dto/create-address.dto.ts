import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { User } from 'src/users/domain/user';

export class CreateAddressDto {
  user: User;

  @ApiPropertyOptional()
  @IsOptional()
  name?: string | null;

  @ApiPropertyOptional({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  createdBy?: User | null;
  updatedBy?: User | null;
}

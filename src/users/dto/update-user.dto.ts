import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform, Type } from 'class-transformer';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { User } from '../domain/user';
import { Key } from 'src/keys/domain/key';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @Transform(lowerCaseTransformer)
  @IsOptional()
  username?: string | null;

  @ApiPropertyOptional({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(55)
  @MaxLength(55)
  zkAppAddress?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(55)
  @MaxLength(55)
  minaAddress?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  sharedkeys?: Key | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  sharedOtps?: Key | null;

  provider?: string;

  socialId?: string | null;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ type: FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  hash?: string | null;

  updatedBy?: User | null;
}

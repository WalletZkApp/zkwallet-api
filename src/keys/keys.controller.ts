import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DeepPartial } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { Key } from './domain/key';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';

import { RolesGuard } from 'src/roles/roles.guard';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Keys')
@Controller({
  path: 'keys',
  version: '1',
})
export class KeysController {
  constructor(private keyService: KeysService) {}

  @SerializeOptions({
    groups: ['user'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createKeyDto: CreateKeyDto): Promise<Key> {
    return this.keyService.create(createKeyDto);
  }

  @SerializeOptions({
    groups: ['user'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async findOne(@Param('id') id: Key['id']): Promise<NullableType<Key>> {
    return this.keyService.findOne({ id });
  }

  @SerializeOptions({
    groups: ['user'],
  })
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async update(
    @Param('id') id: Key['id'],
    @Body() payload: DeepPartial<Key>,
  ): Promise<Key | null> {
    return this.keyService.update(id, payload);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MinaService } from './mina.service';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { DeployDto } from './dto/deploy.dto';
import { UserDecorator } from 'src/users/user.decorator';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Mina')
@Controller({
  path: 'mina',
  version: '1',
})
export class MinaController {
  constructor(private readonly minaService: MinaService) {}

  @SerializeOptions({
    groups: ['user'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async deploy(
    @Body() deployDto: DeployDto,
    @UserDecorator('id') logedInUserId: string,
  ): Promise<string> {
    return this.minaService.deployContract(deployDto, logedInUserId);
  }
}

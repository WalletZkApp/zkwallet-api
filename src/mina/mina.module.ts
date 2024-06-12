import { Module } from '@nestjs/common';
import { MinaService } from './mina.service';
import { MinaController } from './mina.controller';
import { UsersModule } from 'src/users/users.module';
import { KeysModule } from 'src/keys/keys.module';

@Module({
  imports: [KeysModule, UsersModule],
  providers: [MinaService],
  controllers: [MinaController],
})
export class MinaModule {}

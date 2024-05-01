import { Module } from '@nestjs/common';
import { MinaService } from './mina.service';
import { MinaController } from './mina.controller';

@Module({
  providers: [MinaService],
  controllers: [MinaController]
})
export class MinaModule {}

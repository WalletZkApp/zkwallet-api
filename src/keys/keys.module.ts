import { Module } from '@nestjs/common';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { ConfigModule } from '@nestjs/config';
import { RelationalKeyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalKeyPersistenceModule;

@Module({
  imports: [ConfigModule, infrastructurePersistenceModule],
  providers: [KeysService],
  controllers: [KeysController],
  exports: [KeysService, infrastructurePersistenceModule],
})
export class KeysModule {}

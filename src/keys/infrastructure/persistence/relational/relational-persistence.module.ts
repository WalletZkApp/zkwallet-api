import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyEntity } from './entities/key.entity';
import { KeysRelationalRepository } from './repositories/key.repository';
import { KeyRepository } from '../key.repository';

@Module({
  imports: [TypeOrmModule.forFeature([KeyEntity])],
  providers: [
    {
      provide: KeyRepository,
      useClass: KeysRelationalRepository,
    },
  ],
  exports: [KeyRepository],
})
export class RelationalKeyPersistenceModule {}

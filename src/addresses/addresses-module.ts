import { Module } from '@nestjs/common';
import { AddressesService } from './addresses-service';
import { AddressesController } from './addresses.controller';
import { UsersModule } from 'src/users/users.module';
import { RelationalAddressPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalAddressPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, UsersModule],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService, infrastructurePersistenceModule],
})
export class AddressesModule {}

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { AddressRepository } from '../address.repository';
import { AddressesRelationalRepository } from './repositories/address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [
    {
      provide: AddressRepository,
      useClass: AddressesRelationalRepository,
    },
  ],
  exports: [AddressRepository],
})
export class RelationalAddressPersistenceModule {}

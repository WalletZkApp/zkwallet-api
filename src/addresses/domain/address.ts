import { Expose } from 'class-transformer';
import { User } from 'src/users/domain/user';

export class Address {
  id: string;

  user: User;

  @Expose({ groups: ['me', 'admin'] })
  name?: string | null;

  @Expose({ groups: ['me', 'admin'] })
  email?: string | null;

  @Expose({ groups: ['me', 'admin'] })
  address: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy?: User | null;
  updatedBy?: User | null;
}

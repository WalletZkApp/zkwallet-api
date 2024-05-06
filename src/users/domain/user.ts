import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Status } from '../../statuses/domain/status';
import { Key } from 'src/keys/domain/key';

export class User {
  id: string;

  @Expose({ groups: ['me', 'admin'] })
  username?: string | null;

  @Expose({ groups: ['me', 'admin'] })
  email?: string | null;

  @Expose({ groups: ['me', 'admin'] })
  zkAppAddress?: string | null;

  @Expose({ groups: ['me', 'admin'] })
  minaAddress?: string | null;

  @Exclude({ toPlainOnly: true })
  sharedkeys?: Key | null;

  @Exclude({ toPlainOnly: true })
  sharedOtps?: Key | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  // nonce: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: FileType | null;
  role?: Role | null;
  status?: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy?: User | null;
  updatedBy?: User | null;
  deletedBy?: User | null;
}

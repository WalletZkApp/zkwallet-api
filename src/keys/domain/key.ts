import { User } from 'src/users/domain/user';

export enum KeyEnum {
  'privatekey' = 1,
  'otpKey' = 2,
}

export class Key {
  id: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy?: User | null;
  updatedBy?: User | null;
  deletedBy?: User | null;
}

import { Entity } from '@/services/api/types/Entity';
import { Address } from '@/services/api/types/Address';

export enum UserTypes {
  Admin = 'admin',
  Partner = 'partner',
  Customer = 'customer'
}

export interface User extends Entity {
  name: string
  birthday: string | Date
  cpf: string
  email: string
  type: UserTypes
  profilePictureURI?: string
  address?: Address
  password?: string
}

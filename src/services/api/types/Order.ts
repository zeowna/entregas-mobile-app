import { User } from '@/services/api/types/User'
import { Entity } from '@/services/api/types/Entity'
import { CartProduct } from '@/services/api/types/CartProduct'
import { Partner } from '@/services/api/types/Partner'
import { Address } from '@/services/api/types/Address'

export enum OrderStatuses {
  Created = 'created',
  Canceled = 'canceled',
  AwaitingExecution = 'awaiting_execution',
  InDelivery = 'in_delivery',
  Settled = 'Settled'
}

export interface Order extends Entity {
  customer?: User
  partner: Partner
  cart: CartProduct[]
  address: Address
  totalValue: number
  status: OrderStatuses
  statusUpdatedAt: Date
  externalServiceId?: string
}

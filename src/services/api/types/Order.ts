import { CustomerUser } from './CustomerUser'
import { Entity } from './Entity'
import { CartProduct } from './CartProduct'
import { Partner } from './Partner'
import { Address } from './Address'

export enum OrderStatus {
  Created = 'created',
  Canceled = 'canceled',
  AwaitingExecution = 'awaiting_execution',
  InDelivery = 'in_delivery',
  Settled = 'Settled'
}

export enum OrderPaymentMethods {
  DebitCardLocation = 'debit_card_location',
  CreditCardLocation = 'credit_card_location',
  CashLocation = 'cash_location',
  CardRemote = 'card_remote',
}

export interface Order extends Entity {
  partnerId: number
  customer?: CustomerUser
  partner?: Partner
  cart?: CartProduct[]
  address?: Address
  totalValue?: number
  status?: OrderStatus
  statusUpdatedAt?: Date
  paymentMethod: OrderPaymentMethods
  externalServiceId?: string
}

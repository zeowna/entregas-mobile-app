import { AbstractResource } from '@/services/api/AbstractResource'
import { Address, CartProduct, FindEntitiesPaging, FindEntitiesResponse, Order, Product } from '@/services/api/types'

export class CustomerOrdersAddressesResource extends AbstractResource<Address> {
  protected url = '/orders'

  async create(orderId: number, entity: Address) {
    return super.post(`${this.url}/orders/${orderId}/addresses`, entity)
  }
}

export class CustomerOrdersCartProductsResource extends AbstractResource<CartProduct> {
  protected url = '/customer'

  async create(orderId: number, cartProducts: CartProduct[]) {
    return super.post(`${this.url}/orders/${orderId}/cartProducts`, cartProducts)
  }
}

export class CustomerOrdersResource extends AbstractResource<Order> {
  protected url = '/customer'

  addresses = new CustomerOrdersAddressesResource(this.client)
  cart = new CustomerOrdersCartProductsResource(this.client)

  async find(
    customerId: number,
    {
     conditions = {},
     skip = 0,
     limit = 15,
     sort = { updatedAt: -1 }
   }: FindEntitiesPaging = {}) {
    return this.get<FindEntitiesResponse<Order>>(`${this.url}/${customerId}/orders`, {
      conditions: JSON.stringify(conditions),
      skip,
      limit,
      sort: JSON.stringify(sort)
    })
  }

  async create(customerId: number, entity: Order) {
    return super.post(`${this.url}/${customerId}/orders`, entity)
  }
}

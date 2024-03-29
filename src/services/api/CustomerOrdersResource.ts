import { AbstractResource } from '@/services/api/AbstractResource'
import { FindEntitiesPaging, FindEntitiesResponse, Order, OrderStatus } from '@/services/api/types'
import { CustomerOrdersAddressesResource } from "@/services/api/CustomerOrdersAddressesResource";
import { CustomerOrdersCartProductsResource } from "@/services/api/CustomerOrdersCartProductsResource";

export class CustomerOrdersResource extends AbstractResource<Order> {
  protected url = '/customers'

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

  async findById(customerId: number, id: number) {
    return super.get(`${this.url}/${customerId}/orders/${id}`)
  }

  async updateStatus(customerId: number, id: number, status: OrderStatus) {
    return super.patch(`${this.url}/${customerId}/orders/${id}/status`, { status })
  }
}

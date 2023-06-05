import { AbstractResource } from '@/services/api/AbstractResource';
import { Order } from '@/services/api/types';

export class OrdersResource extends AbstractResource {
  async find() {
    const { data } = await this.client.get<Order[]>('/orders')

    return data
  }
}

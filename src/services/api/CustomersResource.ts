import { AbstractResource } from '@/services/api/AbstractResource';
import { Address, CustomerUser } from '@/services/api/types';
import { CustomerOrdersResource } from "@/services/api/OrdersResource";
import { CustomerAddressesResource } from "@/services/api/customerAddressesResource";


export class CustomersResource extends AbstractResource<CustomerUser> {
  protected url = '/customers'

  orders = new CustomerOrdersResource(this.client)
  addresses = new CustomerAddressesResource(this.client);

  async findById(id: number) {
    return super.get(`${this.url}/${id}`)
  }

  async update(id: number, entity: CustomerUser) {
    return super.patch(`${this.url}/${id}`, entity)
  }
}

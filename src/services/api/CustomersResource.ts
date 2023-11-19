import { AbstractResource } from '@/services/api/AbstractResource';
import { CustomerUser } from '@/services/api/types';

export class CustomersResource extends AbstractResource<CustomerUser> {
  protected url = '/customers'

  async findById(id: number) {
    return super.get(`${this.url}/${id}`)
  }

  async update(id: number, entity: CustomerUser) {
    return super.patch(`${this.url}/${id}`, entity)
  }
}

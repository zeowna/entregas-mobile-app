import { AbstractResource } from '@/services/api/AbstractResource';
import { Partner } from '@/services/api/types/Partner';
import { PartnerProduct } from '@/services/api/types';

class PartnerProductsResource extends AbstractResource {
  async find(partnerId: number) {
    const { data } = await this.client<PartnerProduct[]>('/partners/' + partnerId + '/products')

    return data
  }
}

export class PartnersResource extends AbstractResource {

  products = new PartnerProductsResource(this.client)

  async find() {
    const { data } = await this.client<Partner[]>('/partners')

    return data
  }
}

import { PartnersResource } from '@/services/api/PartnersResource';
import axios from 'axios';
import { store } from '@/store';
import { OrdersResource } from '@/services/api/OrdersResource';
import { UserResource } from '@/composables/UserResource';
import { AbstractResource } from '@/services/api/AbstractResource';


class AuthResource extends AbstractResource {
  async signIn(email: string, password: string) {
    const { data } = await this.client.post('/auth', { email, password })

    return data
  }
}

export class Api {
  static client = axios.create({ baseURL: store.state.baseURL })

  static auth = new AuthResource(Api.client)
  static partners = new PartnersResource(Api.client)
  static orders = new OrdersResource(Api.client)
  static users = new UserResource(Api.client)
}

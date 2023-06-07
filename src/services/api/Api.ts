import { PartnersResource } from '@/services/api/PartnersResource';
import axios from 'axios';
import { store } from '@/store';
import { OrdersResource } from '@/services/api/OrdersResource';
import { UserResource } from '@/composables/UserResource';
import { AuthResource } from '@/services/api/AuthResource';


export class Api {
  static client = axios.create({ baseURL: store.state.baseURL })

  static auth = new AuthResource(Api.client)
  static partners = new PartnersResource(Api.client)
  static orders = new OrdersResource(Api.client)
  static users = new UserResource(Api.client)
}

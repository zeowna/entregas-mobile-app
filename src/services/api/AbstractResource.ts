import { AxiosInstance } from 'axios';

export abstract class AbstractResource {
  constructor(protected client: AxiosInstance) {
  }
}

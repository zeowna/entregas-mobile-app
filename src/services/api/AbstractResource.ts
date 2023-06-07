import { AxiosError, AxiosInstance } from 'axios';
import { NotFoundError } from '@/services/api/errors';
import { BadRequestError } from '@/services/api/errors/BadRequestError';


export abstract class AbstractResource {
  constructor(protected client: AxiosInstance) {
  }

  async get<T>(uri: string, params: any, headers = {}) {
    try {
      const { data } = await this.client.get<T>(uri, { headers, params })

      return data
    } catch (err) {
      throw this.handleError(err)
    }
  }

  async post<T>(uri: string, body: any, headers = {}) {
    try {
      const { data } = await this.client.post<T>(uri, body, { headers })

      return data
    } catch (err) {
      throw this.handleError(err)
    }
  }

  handleError(err: any) {
    if (err && err instanceof AxiosError) {
      const { message, errors } = err?.response?.data ?? {}

      switch (err?.response?.status) {
        case 400:
          return new BadRequestError(errors)
        case 404:
          return new NotFoundError(message)
      }
    }

    return err;
  }
}

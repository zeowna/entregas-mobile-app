import { AxiosError, AxiosInstance } from 'axios';
import { UserCreationError, UserNotFoundError } from '@/services/api/errors';
import { BadRequestError } from '@/services/api/errors/badRequestError';


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

      if (err?.response?.status === 400) {
        return new BadRequestError(errors)
      }

      switch (err?.response?.data?.error) {
        case 'USER_NOT_FOUND':
          return new UserNotFoundError(message)
        case 'USER_CREATION_ERROR':
          return new UserCreationError(message)
      }
    }

    return err;
  }
}

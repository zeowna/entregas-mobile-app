import { AbstractResource } from '@/services/api/AbstractResource';
import { User } from '@/services/api/types';

export class UserResource extends AbstractResource {
  async findById(id: number) {
    const { data } = await this.client.get<User>(`/users/${id}`)

    return data
  }

  async create(user: User) {
    return super.post<User>('/users', user)
  }
}

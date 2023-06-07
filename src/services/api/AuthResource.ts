import { AbstractResource } from '@/services/api/AbstractResource';
import { AuthResponse } from '@/services/api/types';

export class AuthResource extends AbstractResource {
  async signIn(email: string, password: string) {
    return super.post<AuthResponse>('/auth', { email, password })
  }
}

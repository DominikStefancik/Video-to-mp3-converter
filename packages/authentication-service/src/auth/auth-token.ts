import { UserRole } from '@local/domain/user/model';

export interface AuthToken {
  username: string;
  role: UserRole;
  token: string;
}

import { Role } from './role';

export interface User {
  username: '';
  email: '';
  roles: Role[];
  password: '';
}

export interface UserResponse {
  id: string;
  username: string;
  roles: Role[];
}

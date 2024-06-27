export interface Login {
  identifier: string;
  username: string;
  token: string;
  roles: string[];
  firstAccess: boolean;
}

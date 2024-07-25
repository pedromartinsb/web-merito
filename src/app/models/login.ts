export interface Login {
  username: string;
  companyId: string;
  companyNames: string[];
  token: string;
  roles: string[];
  firstAccess: boolean;
}

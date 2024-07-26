import { OfficeResponse } from './office';

export interface Login {
  username: string;
  companyId: string;
  companyNames: string[];
  token: string;
  roles: string[];
  firstAccess: boolean;

  officeResponses: OfficeResponse[];
}

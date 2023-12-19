import { Holding } from "./holding";

export interface Company {
  id?: string;
  name: string;
  companyType: CompanyType;

  holdingId: any;
  holding: Holding;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export enum CompanyType {
  HEADQUARTERS = 'HEADQUARTERS',
  FILIAL = 'FILIAL'
}

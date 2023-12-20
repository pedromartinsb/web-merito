import { Holding } from "./holding";

export interface Company {
  id?: string;
  name: string;
  companyType: number;

  holdingId: any;
  holding: Holding;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export enum CompanyType {
  HEADQUARTERS = 1,
  FILIAL = 2
}

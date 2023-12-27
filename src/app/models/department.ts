import { Company } from "./company";
import { Person } from "./person";

export interface Department {
  id?: string;
  name: string;

  companyId: any;
  company: Company;
  person: Person[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

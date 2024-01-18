import { Company } from "./company";
import { Person } from "./person";

export interface Department {
  id?: string;
  name: string;

  companyId: string;
  company: Company;
  person: Person[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

import { Person } from "./person";

export interface Department {
  id?: string;
  name: string;

  companyId: any;
  person: Person[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

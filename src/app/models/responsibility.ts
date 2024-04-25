import { Company } from './company';
import { Routine } from './routine';

export interface Responsibility {
  id?: string;
  name: string;

  companyId: string;
  company: Company;

  routines: Routine[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

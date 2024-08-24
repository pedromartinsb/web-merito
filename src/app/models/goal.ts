import { Person } from './person';

export interface Goal {
  id?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  person: Person;
  persons: Array<string>;
}

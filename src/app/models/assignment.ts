import { Person } from "./person";

export interface Assignment {
  id?: string;
  name: string;

  personId: string;
  person: Person;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

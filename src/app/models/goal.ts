import { Person } from "./person";

export interface Goal {
  id?: string;
  name: string;
  person: Person;
  personId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

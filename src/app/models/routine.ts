import { Person } from "./person";
import { Task } from "./task";

export interface Routine {
  id?: string;
  name: string;

  person: Person;
  personId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

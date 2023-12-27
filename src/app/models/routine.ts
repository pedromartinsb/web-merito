import { Person } from "./person";
import { Task } from "./task";

export interface Routine {
  id?: string;
  name: string;

  persons: Person[];
  personId: string;

  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

import { Person } from "./person";

export interface Task {
  id?: string;
  name: string;

  persons: Person[];
  personId: string;

  startedAt: Date;
  finishedAt: Date;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

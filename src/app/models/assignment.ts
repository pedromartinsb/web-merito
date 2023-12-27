import { Person } from "./person";

export interface Assignment {
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

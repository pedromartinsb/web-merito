import { Person } from "./person";
import { Tag } from "./tag";

export interface Task {
  id?: string;
  name: string;

  persons: Person[];
  personId: string;

  appointment: Tag;

  startedAt: Date;
  finishedAt: Date;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

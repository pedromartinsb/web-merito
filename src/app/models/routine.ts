import { Person } from "./person";
import { Tag } from "./tag";
import { Task } from "./task";

export interface Routine {
  id?: string;
  name: string;

  persons: Person[];
  personId: string;

  appointment: Tag;

  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

import { Person } from "./person";
import { Task } from "./task";

export interface Routine {
  id?: string;
  name: string;

  tasks: Task[];
  taskId: string;

  persons: Person[];
  personId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

import { Person } from "./person";
import { Routine } from "./routine";

export interface Task {
  id?: string;
  name: string;

  routines: Routine[];
  routineId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

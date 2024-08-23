import { Responsibility } from './responsibility';
import { Tag } from './tag';

export interface Routine {
  id?: string;
  name: string;
  appointment: Tag;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  responsibility: Responsibility;
}

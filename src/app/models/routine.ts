import { Responsibility } from './responsibility';
import { Tag } from './tag';

export interface Routine {
  id?: string;
  name: string;
  responsibility: Responsibility;
  responsibilityId: string;
  appointment: Tag;
  startedAt: string;
  finishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

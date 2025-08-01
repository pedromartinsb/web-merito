import { Tag } from './tag';

export interface Appointment {
  id?: string;
  name: string;
  person: any;
  personId: string;
  tag: Tag;
  tagId: string;
  activityType: string;
  description: string;
  justification: string;
  activityId: string;
  routineId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Activity {
  id?: string;
  name: string;
  type: string;
  description: string;
  justification: string;
  tag: Tag;
  tagId: string;
  createdAt: string;
  appointmentId: string;
}

export interface PersonAppointmentRoutineTask {
  id: number;
  user_id: string;
  name: string;
  description: string;
  justification: string;
  tag: string;
  routine?: string;
  task?: string;
  createdAt: string;
}

export interface Appointment {
  id?: string;
  name: string;

  person: any;
  personId: string;

  tag: any;
  tagId: string;

  description: string;
  justification: string;

  assignmentId: string;
  routineId: string;
  taskId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

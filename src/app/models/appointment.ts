export interface Appointment {
  id?: string;
  name: string;

  person: any;
  personId: string;

  tag: any;
  tagId: string;
  
  activityType: string;

  description: string;
  justification: string;

  activityId: string;

  routineId: string;
  taskId: string;
  assignmentId: string;

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
  
  tag: any;
  tagId: string;
}
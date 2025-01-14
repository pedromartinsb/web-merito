export interface Task {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
}

export enum TaskStatus {
  CREATED,
  FINISHED,
  CANCELLED
}

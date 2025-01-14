export interface Goal {
  id?: string;
  name: string;
  title: string;
  description: string;
  status: GoalStatus;
  startDate: string;
  endDate: string;
}

export enum GoalStatus {
  CREATED,
  FINISHED,
  CANCELLED
}

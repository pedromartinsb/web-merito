export interface Routine {
  id?: string;
  name: string;
  responsibilityId: string;
  responsibilityName: string;
}

export interface RoutineRequest {
  name: string;
  responsibilities: string[];
}

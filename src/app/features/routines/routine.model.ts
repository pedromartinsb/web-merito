import { Responsibility } from "../responsibilities/responsibility.model";

export interface Routine {
  id?: string;
  name: string;
  responsibilityId: string;
  responsibilityName: string;

  responsibility: Responsibility;
}

export interface RoutineRequest {
  name: string;
  responsibilities: string[];
}

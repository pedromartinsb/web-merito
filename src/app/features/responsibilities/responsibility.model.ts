export interface Responsibility {
  id?: string;
  name: string;
  officeId: string;
  officeFantasyName: string;
}

export interface ResponsibilityRequest {
  name: string;
  officeId: string;
}

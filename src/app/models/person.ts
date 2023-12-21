import { Routine } from "./routine";
import { Task } from "./task";

export interface Person {
  id?: string;
  personType: number | string;
  name: string;
  cpf: string;
  departmentId: string;
  responsibilityId: string;

  user: User;
  address: Address;

  tasks: Task[];
  taskId: string;

  routines: Routine[];
  routineId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface User {
  username: string;
  email: string;
  role: string[];
  password: string;
}

export interface Address {
  cep: string;
  streetName: string;
  neighborhood: string;
  city: string;
  uf: string;
  complement: string;
}

export enum Roles {
  ROLE_USERS = "ROLE_USERS",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_MODERADOR = "ROLE_MODERADOR"
}

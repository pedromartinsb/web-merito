import { Department } from "./department";
import { Responsibility } from "./responsibility";
import { Role } from "./role";
import { Routine } from "./routine";
import { Task } from "./task";

export interface Person {
  id?: string;
  personType: number | string;
  name: string;
  cpf: string;

  departments: Department[];
  departmentsId: string;
  responsibility: Responsibility;
  responsibilityId: string;

  user: User;
  address: Address;

  tasks: Task[];
  taskId: string;

  routine: Routine[];
  routineId: string;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface User {
  username: string;
  email: string;
  roles: Role[];
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

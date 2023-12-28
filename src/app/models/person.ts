import { Assignment } from "./assignment";
import { Company } from "./company";
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

  department: Department;
  departmentId: string;
  responsibility: Responsibility;
  responsibilityId: string;
  company: Company;
  companyId: string;

  user: User;
  address: Address;

  tasks: Task[];
  routines: Routine[];
  assignments: Assignment[];

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
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_MODERADOR = "ROLE_MODERADOR"
}

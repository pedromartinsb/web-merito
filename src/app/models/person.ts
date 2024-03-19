import { Assignment } from './assignment';
import { Company } from './company';
import { Department } from './department';
import { Responsibility } from './responsibility';
import { Role } from './role';
import { Routine } from './routine';
import { Task } from './task';

export interface Person {
  id?: string;
  personType: number | string;
  name: string;
  cpfCnpj: string;
  gender: string;
  contractType: string;

  department: Department;
  departmentId: string;
  responsibility: Responsibility;
  responsibilityId: string;
  company: Company;
  companyId: string;

  user: User;
  address: Address;
  contact: Contact;

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

export interface UserResponse {
  id: string;
  username: string;
  roles: Role[];
}

export interface Address {
  cep: string;
  streetName: string;
  neighborhood: string;
  city: string;
  uf: string;
  complement: string;
}

export interface Contact {
  phone: string;
  cellphone: string;
}

export interface AddressSearch {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export enum Roles {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_MODERATOR = 'ROLE_MODERATOR',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

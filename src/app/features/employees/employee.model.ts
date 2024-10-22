import {Office} from "../../models/office";
import {Responsibility} from "../../models/responsibility";
import {Role} from "../../models/role";

export interface Employee {
  id?: string;
  personType: number | string;
  name: string;
  cpfCnpj: string;
  gender: string;
  contractType: string;
  picture: string;
  office: Office;
  officeId: string;
  responsibility: Responsibility;
  responsibilityId: string;
  user: User;
  address: Address;
  contact: Contact;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface EmployeeRequest {
  name: string;
  cpfCnpj: string;
  gender: string;
  contractType: ContractType;
  personType: PersonType;
  birthdate: string;
  officeId: string;
  responsibilityId: string;
  supervisorId: string;
  user: User;
  address: Address;
  contact: Contact;
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
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USE',
  ROLE_SUPERVISOR = 'ROLE_SUPERVISOR',
}

export enum ContractType {
  CLT = 'Clt',
}

export enum PersonType {
  EMPLOYEE = 'Colaborador',
  SUPERVISOR = 'Supervisor',
}

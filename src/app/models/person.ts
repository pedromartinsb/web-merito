import { Office } from "./office";
import { Responsibility } from "./responsibility";
import { Role } from "./role";

export interface Person {
  id?: string;
  personType: number | string;
  name: string;
  cpfCnpj: string;
  gender: string;
  birthdate: string;
  contractType: string;
  picture: string;
  office: Office;
  officeId: string;
  officeFantasyName: string;
  responsibility: Responsibility;
  responsibilityId: string;
  user: User;
  supervisor: string;
  accessType: string;
  managerId: string;
  supervisorId: string;
  address: Address;
  contact: Contact;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface User {
  username: string;
  email: string;
  roles: Role[];
  password: string;
  firstAccess?: boolean;
}

export interface UserResponse {
  id: string;
  username: string;
  roles: Role[];
  firstAccess?: boolean;
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
  ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_SUPERVISOR = "ROLE_SUPERVISOR",
  ROLE_MANAGER = "ROLE_MANAGER",
  ROLE_USER = "ROLE_USER",
}

export enum Gender {
  MALE = "Masculino",
  FEMALE = "Feminino",
}

export enum ContractType {
  CLT = "Clt",
  AUTONOMO = "Autônomo",
  SUPPLIER = "Fornecedor",
}

export enum PersonType {
  EMPLOYEE = "EMPLOYEE",
  SUPERVISOR = "SUPERVISOR",
}

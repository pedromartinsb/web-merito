import { Responsibility } from './responsibility';
import { Role } from './role';

export interface Person {
  id?: string;
  personType: number | string;
  name: string;
  cpfCnpj: string;
  gender: string;
  contractType: string;

  responsibility: Responsibility;
  responsibilityId: string;

  user: User;
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
  MALE = 'Masculino',
  FEMALE = 'Feminino',
}

import { Company } from './company';

export interface Office {
  id?: string;
  fantasyName: string;
  corporateReason: string;
  cnpj: string;
  identifier: string;
  email: string;
  website: string;
  companyId: any;
  company: Company;
  contact: Contact;
  address: Address;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Contact {
  phone: string;
  cellphone: string;
}

export interface Address {
  cep: string;
  streetName: string;
  neighborhood: string;
  city: string;
  uf: string;
  complement: string;
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

export interface OfficeResponse {
  id?: string;
  fantasyName: string;
}

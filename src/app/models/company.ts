import { Holding } from "./holding";

export interface Company {
  id?: string;
  fantasyName: string;
  corporateReason: string;
  cnpj: string;
  email: string;
  website: string;

  companyType: string;

  holdingId: any;
  holding: Holding;

  contact: Contact;
  address: Address;

  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export enum CompanyType {
  HEADQUARTERS = 'HEADQUARTERS',
  FILIAL = 'FILIAL'
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

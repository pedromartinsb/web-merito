import { Segment } from './segment';

export interface Holding {
  id?: string;
  fantasyName: string;
  corporateReason: string;
  cnpj: string;
  email: string;
  website: string;

  segment: Segment;
  segmentId: any;

  contact: Contact;
  contactId: any;

  address: Address;
  addressId: any;

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

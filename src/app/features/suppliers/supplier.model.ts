import { Office } from "src/app/models/office";
import { Address, Contact, ContractType, User } from "src/app/models/person";
import { Responsibility } from "src/app/models/responsibility";

export interface Supplier {
  id?: string;
  personType: number | string;
  name: string;
  cpfCnpj: string;
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

export interface SupplierRequest {
  name: string;
  cpfCnpj: string;
  contractType: ContractType;
  personType: PersonType;
  officeId: string;
  responsibilityId: string;
  supervisorId: string;
  user: User;
  address: Address;
  contact: Contact;
}

export enum PersonType {
  EMPLOYEE = 'Colaborador',
  SUPERVISOR = 'Supervisor',
}

import { Component, OnInit } from '@angular/core';
import { Address, Contact } from 'src/app/models/holding';
import { Person, User } from 'src/app/models/person';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
})
export class AccountFormComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    roles: null,
    password: '',
  };

  address: Address = {
    cep: '',
    streetName: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: '',
  };

  contact: Contact = {
    phone: '',
    cellphone: '',
  };

  person: Person = {
    name: '',
    cpfCnpj: '',
    personType: 'Colaborador',
    gender: 'Masculino',
    contractType: 'Clt',
    birthdate: '',
    picture: '',
    office: null,
    officeId: '',
    officeFantasyName: '',
    responsibility: null,
    responsibilityId: '',
    user: this.user,
    supervisor: null,
    supervisorId: '',
    address: this.address,
    contact: this.contact,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  constructor() {}

  ngOnInit(): void {}
}

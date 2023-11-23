import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PersonService } from './../../../services/person.service';
import { Person } from 'src/app/models/person';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-person-update',
  templateUrl: './person-update.component.html',
  styleUrls: ['./person-update.component.css']
})
export class PersonUpdateComponent implements OnInit {

  person: Person = {
    id: '',
    name: '',
    roles: [],
    cpf: '',
    email: '',
    personType: 1,
    password: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  }

  name: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  email: FormControl = new FormControl(null, Validators.email);
  password: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private personService: PersonService,
    private toast: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.findById();
  }

  findById(): void {
    this.personService.findById(this.person.id).subscribe(response => {
      response.roles = [];
      this.person = response;
    });
  }

  update(): void {
    this.personService.update(this.person).subscribe(() => {
      this.toast.success('Colaborador atualizado com sucesso', 'Update');
      this.router.navigate(['person']);
    }, ex => {
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    })
  }

  addRole(role: any): void {
    if (this.person.roles.includes(role)) {
      this.person.roles.splice(this.person.roles.indexOf(role), 1);
    } else {
      this.person.roles.push(role);
    }
  }

  validateFields(): boolean {
    return this.name.valid && this.cpf.valid
      && this.email.valid && this.password.valid
  }

}

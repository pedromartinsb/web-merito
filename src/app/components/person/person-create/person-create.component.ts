import { Router } from '@angular/router';
import { PersonService } from './../../../services/person.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-person-create',
  templateUrl: './person-create.component.html',
  styleUrls: ['./person-create.component.css']
})
export class PersonCreateComponent implements OnInit {

  person: Person = {
    name: '',
    roles: [],
    cpf: '',
    email: '',
    password: '',
    personType: 1,
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
  }

  create(): void {
    this.personService.create(this.person).subscribe({
      next: response => {
        this.toast.success('Colaborador cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['person']);
      },
      error: (ex) => {
        if(ex.error.errors) {
          ex.error.errors.forEach(element => {
            this.toast.error(element.message);
          });
        } else {
          this.toast.error(ex.error.message);
        }
      },
    });
    // this.personService.create(this.person).subscribe(() => {
    //   this.toast.success('Colaborador cadastrado com sucesso', 'Cadastro');
    //   this.router.navigate['person']
    // }, ex => {
    //   if(ex.error.errors) {
    //     ex.error.errors.forEach(element => {
    //       this.toast.error(element.message);
    //     });
    //   } else {
    //     this.toast.error(ex.error.message);
    //   }
    // });
  }

  addPersonType(personTypeRequest: any): void {
    this.person.personType = personTypeRequest;
  }

  validateFields(): boolean {
    return this.name.valid && this.cpf.valid
      && this.email.valid && this.password.valid
  }

}

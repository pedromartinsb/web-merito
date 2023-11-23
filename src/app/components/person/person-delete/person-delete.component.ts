import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PersonService } from './../../../services/person.service';
import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-person-delete',
  templateUrl: './person-delete.component.html',
  styleUrls: ['./person-delete.component.css']
})
export class PersonDeleteComponent implements OnInit {

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

  delete(): void {
    this.personService.delete(this.person.id).subscribe(() => {
      this.toast.success('Colaborador deletado com sucesso', 'Delete');
      this.router.navigate(['person']);
    }, ex => {
      if(ex.error.errors) {
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      } else {
        this.toast.error(ex.error.message);
      }
    });
  }

}

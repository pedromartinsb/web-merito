import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Routine } from 'src/app/models/routine';
import { Person } from 'src/app/models/person';
import { RoutineService } from 'src/app/services/routine.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-routine-form',
  templateUrl: './routine-form.component.html',
  styleUrls: ['./routine-form.component.css'],
})
export class RoutineFormComponent implements OnInit {
  persons: Person[] = [];

  routine: Routine = {
    name: '',
    personId: '',
    persons: null,
    appointment: null,
    startedAt: '',
    finishedAt: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  routineId: string;
  personId: string;

  isPersonLinkedCreation: boolean = false;

  name: FormControl = new FormControl(null, Validators.minLength(3));
  person: FormControl = new FormControl(null, []);

  public isSaving: boolean = false;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.routineId = this.route.snapshot.params['id'];
    this.personId = this.route.snapshot.params['idPerson'];
    if (this.routineId) {
      this.loadRoutine();
    }
    if (this.personId) {
      this.loadPerson();
      this.isPersonLinkedCreation = true;
    } else {
      this.findAllPersons();
    }
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe((response) => {
      this.persons = response;
      if (this.routineId && this.persons.length > 0 && this.routine.persons) {
        const tempPersonsList: Person[] = this.persons.filter((person) =>
          this.routine.persons.some((p) => p.id === person.id)
        );

        this.person.patchValue(tempPersonsList);
      }
    });
  }

  loadRoutine(): void {
    this.routineService
      .findById(this.routineId)
      .subscribe((response: Routine) => {
        this.routine = response;
        this.person.setValue(response.persons);
      });
  }

  loadPerson(): void {
    this.personService.findById(this.personId).subscribe((response: Person) => {
      this.person.setValue(response);
      this.routine.persons.push(response);
    });
  }

  openRoutineForm(): void {
    if (this.routineId) {
      this.updateRoutine();
    } else {
      this.createRoutine();
    }
  }

  private createRoutine(): void {
    this.isSaving = true;
    this.routineService.create(this.routine).subscribe({
      next: () => {
        // this.addPersonsToRoutine();
        this.toast.success('Rotina cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['routine']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateRoutine(): void {
    this.isSaving = true;
    this.routineService.update(this.routineId, this.routine).subscribe({
      next: () => {
        if (this.routine.persons.length > 0) this.addPersonsToRoutine();
        this.toast.success('Rotina atualizada com sucesso', 'Atualização');
        this.router.navigate(['routine']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private addPersonToRoutine(): void {
    this.routineService
      .addPersonToRoutine(this.personId, this.routineId)
      .subscribe({
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  private addPersonsToRoutine(): void {
    let routineNewPersonsIds = this.routine.persons.map((p) => p.id);
    this.routineService
      .addPersonsToRoutine(routineNewPersonsIds, this.routineId)
      .subscribe({
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid;
  }

  selectPerson() {
    if (this.person.value) {
      let person: Person = this.person.value;
      this.personId = person.id;
    }
  }
}

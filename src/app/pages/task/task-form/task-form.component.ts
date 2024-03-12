import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Routine } from 'src/app/models/routine';
import { Person } from 'src/app/models/person';
import { RoutineService } from 'src/app/services/routine.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {

  persons: Person[] = [];

  task: Task = {
    name: '',
    personId: '',
    persons: null, 
    appointment: null,
    startedAt: new Date(),
    finishedAt: new Date(),
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  taskId: string;
  personId: string;

  startDate: Date;
  endDate: Date;  

  isPersonLinkedCreation: boolean = false;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  person:     FormControl = new FormControl(null, []);
  start:       FormControl = new FormControl(null, Validators.minLength(3));
  end:     FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.personId = this.route.snapshot.params['idPerson'];
    if (this.taskId) {
      this.loadTask();
    }
    if (this.personId) {
      this.loadPerson();
      this.isPersonLinkedCreation = true;
    } else {
      this.findAllPersons();
    }
    this.initializeDate();
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
      if (this.taskId && this.persons.length > 0 && this.task.persons) {
        const tempPersonsList: Person[] = this.persons.filter(person =>
          this.task.persons.some(p => p.id === person.id)
        );
  
        this.person.patchValue(tempPersonsList);
      }
    });
  }

  loadTask(): void {
    this.taskService.findById(this.taskId).subscribe(response => {
      this.task = response;
      this.person.setValue(response.persons);
    });
  }

  loadPerson(): void {
    this.personService.findById(this.personId).subscribe((response: Person) => {
      this.person.setValue(response);
      this.task.persons.push(response);
    });
  }

  openTaskForm(): void {
    if (this.taskId) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }
  
  private createTask(): void {
    this.taskService.create({ ...this.task, startedAt: this.startDate, finishedAt: this.endDate }).subscribe({
      next: () => {
        this.addPersonsToTask();
        this.toast.success('Atividade cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['task']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateTask(): void {
    this.taskService.update(this.taskId, { ...this.task, startedAt: this.startDate, finishedAt: this.endDate }).subscribe({
      next: () => {
        if (this.person.value.length > 0) this.addPersonsToTask();
        this.toast.success('Atividade atualizada com sucesso', 'Atualização');
        this.router.navigate(['task']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private addPersonToTask(): void {    
    this.taskService.addPersonToTask(this.personId, this.taskId).subscribe({
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private addPersonsToTask(): void {
    if (this.taskId) {
      let taskNewPersonsIds = this.person.value.map(p => p.id);
      this.taskService.addPersonsToTask(taskNewPersonsIds, this.taskId).subscribe({
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
    }    
  }
  
  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach(element => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid && this.start.valid && this.end.valid;
  }

  selectPerson() {   
    if (this.person.value) {
      let person: Person = this.person.value;
      this.personId = person.id;
    }
  }

  initializeDate() {
    this.task.startedAt.setHours(0, 0, 0, 0);
    this.task.finishedAt.setHours(0, 0, 0, 0);
  }
}

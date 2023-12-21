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

  routines: Routine[] = [];
  persons: Person[] = [];
  personsSelected: Person[] = [];

  task: Task = {
    name: '',
    routines: null, 
    routineId: '',    
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  taskId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  routine:     FormControl = new FormControl(null, []);
  person:     FormControl = new FormControl(null, []);

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
    if (this.taskId) {
      this.loadTask();
    }
    this.findAllRoutines();
    this.findAllPersons();
  }

  findAllRoutines(): void {
    this.routineService.findAll().subscribe(response => {
      this.routines = response;
    });
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
    });
  }

  loadTask(): void {
    this.taskService.findById(this.taskId).subscribe(response => {
      this.task = response;
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
    this.taskService.create(this.task).subscribe({
      next: () => {
        this.toast.success('Atividade cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['task']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateTask(): void {
    this.taskService.update(this.taskId, this.task).subscribe({
      next: () => {
        this.toast.success('Atividade atualizada com sucesso', 'Atualização');
        this.router.navigate(['task']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
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
    return this.name.valid;
  }

}

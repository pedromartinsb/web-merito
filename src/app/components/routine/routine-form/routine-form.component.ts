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
  selector: 'app-routine-form',
  templateUrl: './routine-form.component.html',
  styleUrls: ['./routine-form.component.css']
})
export class RoutineFormComponent implements OnInit {

  tasks: Task[] = [];
  persons: Person[] = [];

  routine: Routine = {
    name: '',
    tasks: null, 
    taskId: '',
    person: null, 
    personId: '',     
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  routineId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  task:     FormControl = new FormControl(null, []);
  person:     FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private routineService: RoutineService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.routineId = this.route.snapshot.params['id'];
    if (this.routineId) {
      this.loadRoutine();
    }
    this.findAllTasks();
    this.findAllPersons();
  }

  findAllTasks(): void {
    this.taskService.findAll().subscribe((response: Task[]) => {
      this.tasks = response;
      if (this.routineId) {
        let tempTaskList: Task[];
        this.tasks.forEach(task => {
          tempTaskList.push(this.routine.tasks.find(t => t.id === task.id));
        });
        this.task.setValue(tempTaskList);
      }
    });
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
      if (this.routineId) {
        this.person.setValue(response.find(p => p.id === this.routine.person.id));
        this.routine.personId = this.routine.person.id;
      }
    });
  }

  loadRoutine(): void {
    this.routineService.findById(this.routineId).subscribe(response => {
      this.routine = response;
    });
  }

  openRoutineForm(): void {
    if (this.routine.person) this.routine.personId = this.routine.person.id;
    if (this.routine.tasks && this.routine.tasks.length > 0) this.routine.taskId = this.routine.tasks[0].id;
    if (this.routineId) {
      this.updateRoutine();
    } else {
      this.createRoutine();
    }
  }
  
  private createRoutine(): void {
    this.routineService.create(this.routine).subscribe({
      next: () => {
        this.toast.success('Rotina cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['routine']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateRoutine(): void {
    this.routineService.update(this.routineId, this.routine).subscribe({
      next: () => {
        this.toast.success('Rotina atualizada com sucesso', 'Atualização');
        this.router.navigate(['routine']);
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

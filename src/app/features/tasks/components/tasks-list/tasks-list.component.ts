import {Component, OnInit} from '@angular/core';
import {TasksService} from "../../services/tasks.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  taskHeaders = [
    'Id',
    'Título',
    'PersonId',
    'Funcionário',
    'Cargo',
    'Status'
  ];
  taskData = [];
  loading: boolean = true; // Estado de carregamento

  constructor(private tasksService: TasksService, private toast: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this._tasks();
  }

  _tasks() {
    this.tasksService.findAllByOffice().subscribe({
      next: (tasks) => {
        if (tasks != null) {
          tasks.forEach((response) => {
            const task = [
              response.id,
              response.title,
              response.person.id,
              response.person.name,
              response.person.responsibility.name,
              response.status,
            ];
            this.taskData.push(task);
          });
          this.loading = false;
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.loading = false;
      },
    });
  }

  onFinish(row: any) {
    console.log(row);
    this.tasksService.finish(row[0]).subscribe({
      next: () => {
        window.location.reload();
        this.toast.success('Tarefa concluída com sucesso.');
      },
      error: (error: Error) => {
        this._handleErrors(error);
      },
    });
  }

  onEdit(row: any) {
    console.log(row);
  }

  onDelete(row: any) {
    this.tasksService.cancel(row[0]).subscribe({
      next: () => {
        window.location.reload();
        this.toast.success('Tarefa cancelada com sucesso.');
      },
      error: (error: Error) => {
        this._handleErrors(error);
      },
    });
  }

  _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}

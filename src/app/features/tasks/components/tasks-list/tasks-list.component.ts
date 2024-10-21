import { Component, OnInit } from '@angular/core';
import {Urls} from "../../../../config/urls.config";
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
    'Nome',
  ];
  taskData = [];
  loading: boolean = true; // Estado de carregamento

  constructor(private tasksService: TasksService, private toast: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this._tasks();
  }

  private _tasks() {
    this.tasksService.findAll().subscribe({
      next: (tasks) => {
        if (tasks != null) {
          tasks.forEach((response) => {
            const task = [
              response.id,
              response.name
            ];
            console.log(response)
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

  // Métodos para emitir os eventos de ação
  onEdit(task: any) {
    console.log(task);
    const id = task[0];
    this.router.navigate(['/tasks/edit/', id]);
  }

  onDelete(row: any) {
    console.log(row);
  }

  onView(row: any) {
    console.log(row);
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}

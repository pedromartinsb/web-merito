import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from 'src/app/services/task.service';

export interface DialogData {
  personId: string;
}

export interface Task {
  id?: string;
  personId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-person-appointment-task',
  templateUrl: './person-appointment-task.component.html',
  styleUrls: ['./person-appointment-task.component.css'],
})
export class PersonAppointmentTaskComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  descriptionFormControl: FormControl = new FormControl(
    null,
    Validators.minLength(3)
  );
  task: Task = {
    id: '',
    personId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toast: ToastrService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.task.personId = this.data.personId;
    this._findTaskByPersonId();
  }

  private _findTaskByPersonId() {
    // this.taskService.findByPersonId(this.data.personId).subscribe({
    //   next: (response) => {
    //     if (response != null) {
    //       this.task = response;
    //     }
    //   },
    //   error: (ex) => {
    //     this._handleErrors(ex);
    //   },
    // });
  }

  public save() {
    this.taskService.create(this.task).subscribe({
      next: () => {
        this.toast.success('Tarefa cadastrada com sucesso', 'Cadastro');
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  public validateFields(): boolean {
    return (
      this.task.description.length > 0 &&
      this.task.startDate != '' &&
      this.task.endDate != ''
    );
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

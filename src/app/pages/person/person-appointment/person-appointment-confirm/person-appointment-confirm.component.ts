import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Activity, Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

export interface DialogData {
  tagId: string;
  activityId: string;
  personId: string;
  activityType: string;
  activity: Activity;
}

@Component({
  selector: 'app-person-appointment-confirm',
  templateUrl: './person-appointment-confirm.component.html',
  styleUrls: ['./person-appointment-confirm.component.scss'],
})
export class PersonAppointmentConfirmComponent implements OnInit {
  appointment: Appointment = {
    id: '',
    name: '',
    person: null,
    personId: '',
    tag: null,
    tagId: '',
    activityType: '',
    description: '',
    justification: '',
    activityId: '',
    routineId: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };
  description: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private appointmentService: AppointmentService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data.activity.description != null) {
      this.appointment.description = this.data.activity.description;
    }
  }

  public save(): void {
    this.appointment.personId = this.data.personId;
    this.appointment.tagId = this.data.tagId;
    this.appointment.activityId = this.data.activityId;
    this.appointment.activityType = this.data.activityType;
    this.appointmentService.create(this.appointment).subscribe({
      next: () => {
        this.toast.success('Avaliação criada com sucesso', 'Cadastro');
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  public validateFields(): boolean {
    return this.description.valid;
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
}

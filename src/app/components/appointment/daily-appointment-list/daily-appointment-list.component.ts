import { MatTableDataSource } from '@angular/material/table';
import { Activity, Appointment } from '../../../models/appointment';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AppointmentService } from 'src/app/services/appointment.service';
import { Tag } from 'src/app/models/tag';

@Component({
  selector: 'app-daily-appointment-list',
  templateUrl: './daily-appointment-list.component.html',
  styleUrls: ['./daily-appointment-list.component.css']
})
export class DailyAppointmentListComponent implements OnInit {

  @Input() personRoutines: Activity[] = [];
  @Input() personTasks: Activity[] = [];
  @Input() personAssignments: Activity[] = [];
  @Input() tags: Tag[] = [];
  
  @Output() openDescriptionDialog: EventEmitter<Activity> = new EventEmitter<Activity>();

  constructor(
    private service: AppointmentService
  ) { }

  ngOnInit(): void {}

  handleOpenDescription(activity: Activity): void {
    this.openDescriptionDialog.emit(activity);
  }

}

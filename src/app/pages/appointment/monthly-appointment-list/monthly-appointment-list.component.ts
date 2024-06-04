import { Component, Input, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';

@Component({
  selector: 'app-monthly-appointment-list',
  templateUrl: './monthly-appointment-list.component.html',
  styleUrls: ['./monthly-appointment-list.component.css'],
})
export class MonthlyAppointmentListComponent implements OnInit {
  @Input() personId: String;
  selectedDate: Date | null = null;
  startDate: Date = new Date();
  endDate: Date = new Date();
  appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {}

  public onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.startDate = new Date(date.setUTCHours(0, 0, 0, 0));
    this.endDate = new Date(date.setUTCHours(23, 59, 59, 999));
    this.appointmentService
      .findByPersonAndDate(this.personId, this.startDate, this.endDate)
      .subscribe((response: Appointment[]) => {
        this.appointments = response;
        console.log('appointments: ' + this.appointments);
      });
  }
}

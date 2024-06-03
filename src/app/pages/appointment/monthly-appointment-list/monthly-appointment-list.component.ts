import { Component } from '@angular/core';

@Component({
  selector: 'app-monthly-appointment-list',
  templateUrl: './monthly-appointment-list.component.html',
  styleUrls: ['./monthly-appointment-list.component.css'],
})
export class MonthlyAppointmentListComponent {
  selectedDate: Date | null = null;

  onDateSelected(date: Date): void {
    this.selectedDate = date;
  }
}

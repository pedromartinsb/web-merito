import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-employee-appointment',
  templateUrl: './employee-appointment.component.html',
  styleUrls: ['./employee-appointment.component.css']
})
export class EmployeeAppointmentComponent implements OnInit {

  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  months: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  calendar: number[][] = [];

  constructor() { }

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();

    let day = 1;
    const calendar: number[][] = [];
    let week: number[] = Array(7).fill(0);

    // Preencher os dias vazios antes do primeiro dia do mês
    for (let i = 0; i < firstDay; i++) {
      week[i] = 0; // Dias vazios
    }

    // Preencher os dias do mês
    for (let i = firstDay; i < 7; i++) {
      week[i] = day++;
    }

    calendar.push(week);

    while (day <= daysInMonth) {
      week = Array(7).fill(0);
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        week[i] = day++;
      }
      calendar.push(week);
    }

    this.calendar = calendar;
  }

}

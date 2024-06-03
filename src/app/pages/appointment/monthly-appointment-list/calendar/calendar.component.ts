import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<Date>();
  selectedDate: Date | null = null;

  onSelect(date: Date): void {
    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.getDate();
      const month = cellDate.getMonth();
      const year = cellDate.getFullYear();

      if (
        this.selectedDate &&
        date === this.selectedDate.getDate() &&
        month === this.selectedDate.getMonth() &&
        year === this.selectedDate.getFullYear()
      ) {
        return 'selected-date';
      }
    }
    return '';
  };
}

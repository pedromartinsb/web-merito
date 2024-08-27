import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements AfterViewInit {
  @Input() displayedColumns: string[] = [];
  @Input() dataSource = new MatTableDataSource();
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() isLoading: boolean = false;
  @Output() openAppointmentEvent = new EventEmitter<string>();
  @Output() editEvent = new EventEmitter<string>();
  @Output() getRoutinesByPersonEvent = new EventEmitter<string>();
  @Output() getGoalsByPersonEvent = new EventEmitter<string>();
  @Output() openDeleteConfirmationModalEvent = new EventEmitter<string>();

  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public openAppointment(value: string) {
    this.openAppointmentEvent.emit(value);
  }

  public edit(value: string) {
    this.editEvent.emit(value);
  }

  public getRoutinesByPerson(value: string) {
    this.getRoutinesByPersonEvent.emit(value);
  }

  public getGoalsByPerson(value: string) {
    this.getGoalsByPersonEvent.emit(value);
  }

  public openDeleteConfirmationModal(value: string) {
    this.openDeleteConfirmationModalEvent.emit(value);
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

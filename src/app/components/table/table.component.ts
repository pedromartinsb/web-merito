import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from 'src/app/models/person';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnChanges {
  @Input() displayedColumns: string[] = [];
  // @Input() dataSource = new MatTableDataSource<Person>();
  @Input() persons: Person[] = [];
  @Input() title: string = '';
  @Input() iconCardTitle: string = '';
  @Input() iconSearch: string = '';
  @Input() iconAdd: string = '';
  @Input() subtitle: string = '';
  @Input() isLoading: boolean = false;
  @Output() openAppointmentEvent = new EventEmitter<string>();
  @Output() editEvent = new EventEmitter<string>();
  @Output() getRoutinesByPersonEvent = new EventEmitter<string>();
  @Output() getGoalsByPersonEvent = new EventEmitter<string>();
  @Output() openDeleteConfirmationModalEvent = new EventEmitter<string>();
  dataSource = new MatTableDataSource<Person>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<Person>(this.persons);
    this.dataSource.paginator = this.paginator;
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

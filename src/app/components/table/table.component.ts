import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Person } from 'src/app/models/person';
import { AppointmentService } from 'src/app/services/appointment.service';
import { CommunicationComponent } from '../communication/communication.component';
import { AuthService } from 'src/app/services/auth.service';

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
  tags: any;
  lastMonth: any;
  lastTwoMonth: any;
  lastThreeMonth: any;
  lastFourMonth: any;
  lastFiveMonth: any;
  isAdmin: boolean = false;
  isAdminGeral: boolean = false;
  isAdminEmpresa: boolean = false;
  isAdminOffice: boolean = false;
  isSupervisor: boolean = false;
  isUserOffice: boolean = false;
  isGuest: boolean = false;
  userRole: string[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this._checkPermission();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource<Person>(this.persons);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public openAppointment(personId: string): void {
    var date = new Date();

    this.getLastMonth(date, personId);
    this.getLastTwoMonth(date, personId);
    this.getLastThreeMonth(date, personId);
    this.getLastFourMonth(date, personId);
    this.getLastFiveMonth(date, personId);

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.appointmentService
      .getMonthlyTags(personId, firstDay, lastDay)
      .pipe(
        finalize(() => {
          this.router.navigate(['person', 'appointment', personId]);
        })
      )
      .subscribe({
        next: (response) => {
          this.tags = response;
          localStorage.setItem('currentMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  private getLastMonth(date: Date, personId: string): void {
    var firstDayLastMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    );
    var lastDayLastMonth = new Date(
      date.getFullYear(),
      firstDayLastMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastMonth, lastDayLastMonth)
      .subscribe({
        next: (response) => {
          this.lastMonth = response;
          localStorage.setItem('lastMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  private getLastTwoMonth(date: Date, personId: string): void {
    var firstDayLastTwoMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 2,
      1
    );
    var lastDayLastTwoMonth = new Date(
      date.getFullYear(),
      firstDayLastTwoMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastTwoMonth, lastDayLastTwoMonth)
      .subscribe({
        next: (response) => {
          this.lastTwoMonth = response;
          localStorage.setItem('lastTwoMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  private getLastThreeMonth(date: Date, personId: string): void {
    var firstDayLastThreeMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 3,
      1
    );
    var lastDayLastThreeMonth = new Date(
      date.getFullYear(),
      firstDayLastThreeMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastThreeMonth, lastDayLastThreeMonth)
      .subscribe({
        next: (response) => {
          this.lastThreeMonth = response;
          localStorage.setItem('lastThreeMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  private getLastFourMonth(date: Date, personId: string): void {
    var firstDayLastFourMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 4,
      1
    );
    var lastDayLastFourMonth = new Date(
      date.getFullYear(),
      firstDayLastFourMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastFourMonth, lastDayLastFourMonth)
      .subscribe({
        next: (response) => {
          this.lastFourMonth = response;
          localStorage.setItem('lastFourMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  private getLastFiveMonth(date: Date, personId: string): void {
    var firstDayLastFiveMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 5,
      1
    );
    var lastDayLastFiveMonth = new Date(
      date.getFullYear(),
      firstDayLastFiveMonth.getMonth() + 1,
      0
    );
    this.appointmentService
      .getMonthlyTags(personId, firstDayLastFiveMonth, lastDayLastFiveMonth)
      .subscribe({
        next: (response) => {
          this.lastFiveMonth = response;
          localStorage.setItem('lastFiveMonth', JSON.stringify(response));
        },
        error: (err) => console.log(err),
      });
  }

  public edit(value: string) {
    this.editEvent.emit(value);
  }

  public openNotification(value: string, name: string) {
    const dialogRef = this.dialog.open(CommunicationComponent, {
      data: {
        id: value,
        name: name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
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

  private _checkPermission(): void {
    this.userRole = this.authService.getRole();
    this.userRole.map((role) => {
      switch (role) {
        case 'ROLE_ADMIN':
          this.isAdmin = true;
          break;
        case 'ROLE_ADMIN_GERAL':
          this.isAdminGeral = true;
          break;
        case 'ROLE_ADMIN_COMPANY':
          this.isAdminEmpresa = true;
          break;
        case 'ROLE_ADMIN_OFFICE':
          this.isAdminOffice = true;
          break;
        case 'ROLE_SUPERVISOR':
          this.isSupervisor = true;
          break;
        case 'ROLE_USER_OFFICE':
          this.isUserOffice = true;
          break;
        default:
          this.isGuest = true;
          break;
      }
    });
  }
}

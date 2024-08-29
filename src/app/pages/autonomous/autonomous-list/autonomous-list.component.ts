import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { Person } from 'src/app/models/person';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-autonomous-list',
  templateUrl: './autonomous-list.component.html',
  styleUrls: ['./autonomous-list.component.css'],
})
export class AutonomousListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'picture',
    'name',
    'fantasyName',
    'responsibility',
    'routines',
    'goals',
    'actions',
  ];
  dataSource = new MatTableDataSource<Person>();
  isLoading: boolean = false;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
  tags: any;
  lastMonth: any;
  lastTwoMonth: any;
  lastThreeMonth: any;
  lastFourMonth: any;
  lastFiveMonth: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private personService: PersonService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this._getAutonomous();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _getAutonomous() {
    this.personService.findAllByContractType('Professional').subscribe({
      next: (response) => {
        if (response != null) {
          response.forEach((r) => {
            if (r.picture != null) {
              r.picture = this.s3Url + r.picture;
            }
          });
          this.dataSource = new MatTableDataSource<Person>(response);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
      },
      error: (err) => console.log(err),
    });
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public edit(personId: string): void {
    this.router.navigate(['autonomous', 'edit', personId]);
  }

  public openDeleteConfirmationModal(personId: string, name: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message = `Tem certeza que deseja desativar o profissional ${name}?`;

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this._deactivatePerson(personId);
      dialogRef.close();
      this.toast.success('Profissional desativado com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  private _deactivatePerson(personId: string): void {
    this.personService.deactivate(personId).subscribe(() => {
      this._getAutonomous();
    });
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

  public getRoutinesByPerson(personId: string): void {
    this.router.navigate(['routine', 'person', personId]);
  }

  public getGoalsByPerson(personId: string): void {
    this.router.navigate(['goal', 'person', personId]);
  }
}

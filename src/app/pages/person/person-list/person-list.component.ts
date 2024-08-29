import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Company } from 'src/app/models/company';
import { Holding } from 'src/app/models/holding';
import { Office } from 'src/app/models/office';
import { monthlyTag } from 'src/app/models/tag';
import { AppointmentService } from 'src/app/services/appointment.service';

import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { Person } from '../../../models/person';
import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
})
export class PersonListComponent implements OnInit {
  @Input() monthlyTags: monthlyTag[] = [];
  holdingId: string;
  companyId: string;
  officeId: string;
  holding: Holding;
  company: Company;
  office: Office;
  persons: Person[] = [];
  tags: any;

  lastMonth: any;
  lastTwoMonth: any;
  lastThreeMonth: any;
  lastFourMonth: any;
  lastFiveMonth: any;

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public isLoading: boolean = false;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';

  constructor(
    private personService: PersonService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private appointmentService: AppointmentService
  ) {
    this.holdingId = this.route.snapshot.params['holdingId'];
    this.companyId = this.route.snapshot.params['companyId'];
    this.officeId = this.route.snapshot.params['officeId'];
  }

  ngOnInit(): void {
    if (this.holdingId) {
      this.findAllByHolding();
    } else if (this.companyId) {
      this.findAllByCompany();
    } else if (this.officeId) {
      this.findAllByOffice();
    } else {
      this.findAll();
    }
  }

  private findAll() {
    this.personService.findAllByContractType('CLT').subscribe((response) => {
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
    });
  }

  private findAllByHolding() {
    this.personService
      .findAllByHolding(this.holdingId)
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Person>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findAllByCompany() {
    this.personService
      .findAllByCompany(this.companyId)
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Person>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findAllByOffice() {
    this.personService.findAllByOffice(this.officeId).subscribe((response) => {
      this.dataSource = new MatTableDataSource<Person>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  public findRoutinesByPerson(personId: string): void {
    this.router.navigate(['routine', 'person', personId]);
  }

  public findGoalsByPerson(personId: string): void {
    this.router.navigate(['goal', 'person', personId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public editPerson(personId: string): void {
    this.router.navigate(['person', 'edit', personId]);
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

  public openDeleteConfirmationModal(personId: string, name: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message = `Tem certeza que deseja desativar o colaborador ${name}?`;

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this._deactivatePerson(personId);
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  private _deactivatePerson(personId: string): void {
    this.personService.deactivate(personId).subscribe(() => {
      this.toast.success('Colaborador desativado com sucesso', 'Excluir');
      this.findAll();
    });
  }
}

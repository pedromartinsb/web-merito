import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  ELEMENT_DATA: Person[] = [];
  FILTERED_DATA: Person[] = [];

  displayedColumns: string[] = [
    'picture',
    'name',
    'fantasyName',
    'responsibility',
    'routines',
    'goals',
    'actions',
  ];
  dataSource = new MatTableDataSource<Person>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public isLoading: boolean = false;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';

  constructor(
    private personService: PersonService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.holdingId = this.route.snapshot.params['holdingId'];
    this.companyId = this.route.snapshot.params['companyId'];
    this.officeId = this.route.snapshot.params['officeId'];
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
        this.ELEMENT_DATA = response;
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
        this.ELEMENT_DATA = response;
        this.dataSource = new MatTableDataSource<Person>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findAllByCompany() {
    this.personService
      .findAllByCompany(this.companyId)
      .subscribe((response) => {
        this.ELEMENT_DATA = response;
        this.dataSource = new MatTableDataSource<Person>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findAllByOffice() {
    this.personService.findAllByOffice(this.officeId).subscribe((response) => {
      this.ELEMENT_DATA = response;
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
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.appointmentService
      .getMonthlyTags(personId, firstDay, lastDay)
      .subscribe((response) => {
        this.router.navigate(['person', 'appointment', personId], {
          state: { monthlyTags: response },
        });
      });
  }

  openDeleteConfirmationModal(personId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar este colaborador?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deletePerson(personId);
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deletePerson(personId: string): void {
    this.personService.delete(personId).subscribe(() => {
      this.toast.success('Colaborador deletado com sucesso', 'Excluir');
      this.findAll();
    });
  }
}

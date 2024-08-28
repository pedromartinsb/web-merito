import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { Person } from 'src/app/models/person';
import { AppointmentService } from 'src/app/services/appointment.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
})
export class SupplierListComponent implements OnInit, AfterViewInit {
  isLoading: boolean = false;
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';
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

  constructor(
    private personService: PersonService,
    private appointmentService: AppointmentService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this._getSuppliers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private _getSuppliers() {
    console.log('_getSuppliers');

    this.personService.findAllByContractType('Supplier').subscribe({
      next: (response) => {
        if (response != null) {
          response.forEach((r) => {
            if (r.picture != null) {
              r.picture = this.s3Url + r.picture;
            }
          });
          this.dataSource = new MatTableDataSource<Person>(response);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => console.log(err),
    });
    this.isLoading = false;
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

  public openDeleteConfirmationModal(personId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja desativar o Fornecedor?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this._deactivatePerson(personId);
      dialogRef.close();
      this.toast.success('Fornecedor desativado com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  private _deactivatePerson(personId: string): void {
    this.personService.deactivate(personId).subscribe(() => {
      this._getSuppliers();
    });
  }

  public edit(personId: string): void {
    this.router.navigate(['supplier', 'edit', personId]);
  }

  public getRoutinesByPerson(personId: string): void {
    this.router.navigate(['routine', 'person', personId]);
  }

  public getGoalsByPerson(personId: string): void {
    this.router.navigate(['goal', 'person', personId]);
  }
}

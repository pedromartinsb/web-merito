import { Router } from '@angular/router';
import { AppointmentService } from './../../../services/appointment.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PersonService } from 'src/app/services/person.service';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from 'src/app/models/person';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent implements OnInit, AfterViewInit {
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
      'Tem certeza que deseja desativar o profissional?';

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

  public edit(personId: string): void {
    this.router.navigate(['autonomous', 'edit', personId]);
  }

  public getRoutinesByPerson(personId: string): void {
    this.router.navigate(['routine', 'person', personId]);
  }

  public getGoalsByPerson(personId: string): void {
    this.router.navigate(['goal', 'person', personId]);
  }
}

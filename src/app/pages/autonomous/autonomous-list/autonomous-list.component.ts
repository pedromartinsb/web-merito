import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  public isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private personService: PersonService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findAll();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  findAll() {
    this.personService
      .findAllByContractType('Professional')
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Person>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editPerson(personId: string): void {
    this.router.navigate(['autonomous', 'edit', personId]);
  }

  openDeleteConfirmationModal(personId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar este profissional?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deletePerson(personId);
      dialogRef.close();
      this.toast.success('Profissional deletado com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deletePerson(personId: string): void {
    this.personService.delete(personId).subscribe(() => {
      this.findAll();
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

  public findRoutinesByPerson(personId: string): void {
    this.router.navigate(['routine', 'person', personId]);
  }

  public findGoalsByPerson(personId: string): void {
    this.router.navigate(['goal', 'person', personId]);
  }
}

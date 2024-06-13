import { PersonService } from '../../../services/person.service';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from '../../../models/person';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { ToastrService } from 'ngx-toastr';
import { Holding } from 'src/app/models/holding';
import { Company } from 'src/app/models/company';
import { Office } from 'src/app/models/office';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent implements OnInit {
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
    'name',
    'fantasyName',
    'responsibility',
    'routines',
    'goals',
    'actions',
  ];
  dataSource = new MatTableDataSource<Person>(this.persons);

  public isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private personService: PersonService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService
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
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Person>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;

      console.log(this.dataSource);
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

  editPerson(personId: string): void {
    this.router.navigate(['person', 'edit', personId]);
  }

  openDeleteConfirmationModal(personId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar este colaborador?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deletePerson(personId);
      dialogRef.close();
      this.toast.success('Colaborador deletado com sucesso', 'Excluir');
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
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-autonomous-list',
  templateUrl: './autonomous-list.component.html',
  styleUrls: ['./autonomous-list.component.css'],
})
export class AutonomousListComponent implements OnInit {
  persons: Person[] = [];

  ELEMENT_DATA: Person[] = [];
  FILTERED_DATA: Person[] = [];

  displayedColumns: string[] = [
    'name',
    'email',
    'cpfCnpj',
    'responsibility',
    'fantasyName',
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
    this.isLoading = true;
    this.findAll();
  }

  findAll() {
    this.personService
      .findAllByContractType('Professional')
      .subscribe((response) => {
        this.persons = response;
        this.dataSource = new MatTableDataSource<Person>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}

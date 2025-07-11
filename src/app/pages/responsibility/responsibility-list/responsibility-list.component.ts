import { ResponsibilityService } from '../../../services/responsibility.service';
import { Responsibility } from '../../../models/responsibility';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-responsibility-list',
  templateUrl: './responsibility-list.component.html',
  styleUrls: ['./responsibility-list.component.css'],
})
export class ResponsibilityListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'fantasyName', 'actions'];
  dataSource = new MatTableDataSource<Responsibility>();

  public isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private responsibilityService: ResponsibilityService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findAll();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  findAll(): void {
    this.responsibilityService.findAll().subscribe((response) => {
      this.dataSource = new MatTableDataSource<Responsibility>(response);
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

  editResponsibility(responsibilityId: string): void {
    this.router.navigate(['responsibility', 'edit', responsibilityId]);
  }

  openDeleteConfirmationModal(responsibilityId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar este cargo?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteResponsibility(responsibilityId);
      dialogRef.close();
      this.toast.success('Cargo deletado com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteResponsibility(responsibilityId: string): void {
    this.responsibilityService.delete(responsibilityId).subscribe(() => {
      this.findAll();
    });
  }
}

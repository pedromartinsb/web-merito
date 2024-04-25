import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { Office } from 'src/app/models/office';
import { OfficeService } from 'src/app/services/office.service';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.css'],
})
export class OfficeListComponent implements OnInit {
  ELEMENT_DATA: Office[] = [];
  FILTERED_DATA: Office[] = [];

  displayedColumns: string[] = [
    'fantasyName',
    'corporateReason',
    'cnpj',
    'company',
    'actions',
  ];
  dataSource = new MatTableDataSource<Office>(this.ELEMENT_DATA);

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private officeService: OfficeService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findAll();
  }

  findAll(): void {
    this.officeService.findAll().subscribe((response) => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Office>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editOffice(officeId: string): void {
    this.router.navigate(['office', 'edit', officeId]);
  }

  openDeleteConfirmationModal(officeId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar esta unidade?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteOffice(officeId);
      dialogRef.close();
      this.toast.success('Unidade deletada com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteOffice(officeId: string): void {
    this.officeService.delete(officeId).subscribe(() => {
      this.findAll();
    });
  }
}

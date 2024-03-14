import { HoldingService } from '../../../services/holding.service';
import { Holding } from '../../../models/holding';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-holding-list',
  templateUrl: './holding-list.component.html',
  styleUrls: ['./holding-list.component.css'],
})
export class HoldingListComponent implements OnInit {
  ELEMENT_DATA: Holding[] = [];
  FILTERED_DATA: Holding[] = [];

  displayedColumns: string[] = [
    'fantasyName',
    'corporateReason',
    'cnpj',
    'actions',
  ];
  dataSource = new MatTableDataSource<Holding>(this.ELEMENT_DATA);

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private holdingService: HoldingService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findAll();
  }

  findAll(): void {
    this.holdingService.findAll().subscribe((response) => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Holding>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editHolding(holdingId: string): void {
    this.router.navigate(['holding', 'edit', holdingId]);
  }

  openDeleteConfirmationModal(holdingId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar esta rede de empresa?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteHolding(holdingId);
      dialogRef.close();
      this.toast.success('Rede de Empresa deletada com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteHolding(holdingId: string): void {
    this.holdingService.delete(holdingId).subscribe(() => {
      this.findAll();
    });
  }
}

import { HoldingService } from './../../../services/holding.service';
import { Holding } from './../../../models/holding';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';

@Component({
  selector: 'app-holding-list',
  templateUrl: './holding-list.component.html',
  styleUrls: ['./holding-list.component.css']
})
export class HoldingListComponent implements OnInit {

  ELEMENT_DATA: Holding[] = [];
  FILTERED_DATA: Holding[] = [];

  displayedColumns: string[] = ['name', 'segment', 'actions'];
  dataSource = new MatTableDataSource<Holding>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private holdingService: HoldingService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.holdingService.findAll().subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Holding>(response);
      this.dataSource.paginator = this.paginator;
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
    
    dialogRef.componentInstance.message = 'Tem certeza que deseja deletar este grupo de empresa?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteHolding(holdingId);

      dialogRef.close();
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

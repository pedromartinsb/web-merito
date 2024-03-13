import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { Segment } from '../../../models/segment';
import { SegmentService } from '../../../services/segment.service';

@Component({
  selector: 'app-segment-list',
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.css'],
})
export class SegmentListComponent implements OnInit {
  ELEMENT_DATA: Segment[] = [];
  FILTERED_DATA: Segment[] = [];

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Segment>(this.ELEMENT_DATA);

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private segmentService: SegmentService,
    private router: Router,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.findAll();
  }

  findAll(): void {
    this.segmentService.findAll().subscribe((response) => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Segment>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editSegment(segmentId: string): void {
    this.router.navigate(['segment', 'edit', segmentId]);
  }

  openDeleteConfirmationModal(segmentId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar este segmento?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteSegment(segmentId);
      dialogRef.close();
      this.toast.success('Segmento deletado com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteSegment(segmentId: string): void {
    this.segmentService.delete(segmentId).subscribe(() => {
      this.findAll();
    });
  }
}

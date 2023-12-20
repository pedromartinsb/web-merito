import { AssignmentService } from './../../../services/assignment.service';
import { Assignment } from './../../../models/assignment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {

  ELEMENT_DATA: Assignment[] = [];
  FILTERED_DATA: Assignment[] = [];

  displayedColumns: string[] = ['name', 'person', 'actions'];
  dataSource = new MatTableDataSource<Assignment>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private assignmentService: AssignmentService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.assignmentService.findAll().subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Assignment>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editAssignment(assignmentId: string): void {    
    this.router.navigate(['assignment', 'edit', assignmentId]);
  }

  openDeleteConfirmationModal(assignmentId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);
    
    dialogRef.componentInstance.message = 'Tem certeza que deseja deletar esta atividade?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteAssignment(assignmentId);

      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteAssignment(assignmentId: string): void {
    this.assignmentService.delete(assignmentId).subscribe(() => {
      this.findAll();
    });
  }

}

import { TaskService } from './../../../services/task.service';
import { Task } from './../../../models/task';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  ELEMENT_DATA: Task[] = [];
  FILTERED_DATA: Task[] = [];

  displayedColumns: string[] = ['name', 'routine', 'person', 'actions'];
  dataSource = new MatTableDataSource<Task>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Task>(this.ELEMENT_DATA);
   }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.taskService.findAll().subscribe(response => {
      if (response) {
        this.ELEMENT_DATA = response;
        this.dataSource = new MatTableDataSource<Task>(response);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  editTask(taskId: string): void {
    this.router.navigate(['task', 'edit', taskId]);
  }

  openDeleteConfirmationModal(taskId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);
    
    dialogRef.componentInstance.message = 'Tem certeza que deseja deletar esta atividade?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteTask(taskId);

      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.delete(taskId).subscribe(() => {
      this.findAll();
    });
  }

}

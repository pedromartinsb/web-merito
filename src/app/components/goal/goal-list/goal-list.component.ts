import { GoalService } from './../../../services/goal.service';
import { Goal } from './../../../models/goal';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit {

  ELEMENT_DATA: Goal[] = [];
  FILTERED_DATA: Goal[] = [];

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Goal>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private goalService: GoalService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.goalService.findAll().subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Goal>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editGoal(goalId: string): void {    
    this.router.navigate(['goal', 'edit', goalId]);
  }

  openDeleteConfirmationModal(goalId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);
    
    dialogRef.componentInstance.message = 'Tem certeza que deseja deletar esta responsabilidade?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteGoal(goalId);

      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteGoal(goalId: string): void {
    this.goalService.delete(goalId).subscribe(() => {
      this.findAll();
    });
  }

}

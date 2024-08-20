import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { Goal } from '../../../models/goal';
import { GoalService } from '../../../services/goal.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css'],
})
export class GoalListComponent implements OnInit, AfterViewInit {
  personId: string;

  displayedColumns: string[] = ['name', 'person', 'actions'];
  dataSource = new MatTableDataSource<Goal>();

  public isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private goalService: GoalService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.dataSource);

    if (!this.personId) {
      this.findAll();
    } else {
      this.findAllByPerson();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private findAll(): void {
    this.goalService.findAll().subscribe((response) => {
      this.dataSource = new MatTableDataSource<Goal>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  private findAllByPerson(): void {
    this.goalService.findAllByPerson(this.personId).subscribe((response) => {
      this.dataSource = new MatTableDataSource<Goal>(response);
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

  editGoal(goalId: string): void {
    this.router.navigate(['goal', 'edit', goalId]);
  }

  openDeleteConfirmationModal(goalId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar esta meta?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteGoal(goalId);
      dialogRef.close();
      this.toast.success('Meta deletada com sucesso', 'Excluir');
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

import { RoutineService } from '../../../services/routine.service';
import { Routine } from '../../../models/routine';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-routine-list',
  templateUrl: './routine-list.component.html',
  styleUrls: ['./routine-list.component.css'],
})
export class RoutineListComponent implements OnInit, AfterViewInit {
  personId: string;

  displayedColumns: string[] = ['name', 'responsibility', 'actions'];
  dataSource = new MatTableDataSource<Routine>();

  public isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private routineService: RoutineService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.personId = this.route.snapshot.params['personId'];
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

  private findAllByPerson(): void {
    this.routineService.findAllByPerson(this.personId).subscribe((response) => {
      this.dataSource = new MatTableDataSource<Routine>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  private findAll(): void {
    this.routineService.findAll().subscribe((response) => {
      this.dataSource = new MatTableDataSource<Routine>(response);
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

  editRoutine(routineId: string): void {
    this.router.navigate(['routine', 'edit', routineId]);
  }

  openDeleteConfirmationModal(routineId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar esta rotina?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteRoutine(routineId);
      dialogRef.close();
      this.toast.success('Rotina deletada com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteRoutine(routineId: string): void {
    this.routineService.delete(routineId).subscribe(() => {
      this.findAll();
    });
  }
}

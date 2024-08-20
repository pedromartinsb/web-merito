import { HoldingService } from '../../../services/holding.service';
import { Holding } from '../../../models/holding';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { ToastrService } from 'ngx-toastr';
import { SegmentService } from 'src/app/services/segment.service';
import { Segment } from 'src/app/models/segment';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-holding-list',
  templateUrl: './holding-list.component.html',
  styleUrls: ['./holding-list.component.css'],
})
export class HoldingListComponent implements OnInit, AfterViewInit {
  segmentId: string;
  segment: Segment;

  displayedColumns: string[] = [
    'fantasyName',
    'cnpj',
    'companies',
    'offices',
    'persons',
    'actions',
  ];
  dataSource = new MatTableDataSource<Holding>();

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private holdingService: HoldingService,
    private segmentService: SegmentService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {
    this.isLoading = true;
    this.segmentId = this.route.snapshot.params['segmentId'];
  }

  ngOnInit(): void {
    if (!this.segmentId) {
      this.findAll();
    } else {
      this.findAllBySegment();
      this.findSegmentById();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private findAllBySegment(): void {
    this.holdingService
      .findAllBySegment(this.segmentId)
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Holding>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findAll(): void {
    this.holdingService.findAll().subscribe((response) => {
      this.dataSource = new MatTableDataSource<Holding>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  private findSegmentById(): void {
    this.segmentService.findById(this.segmentId).subscribe((response) => {
      this.segment = response;
    });
  }

  public findCompaniesByHolding(holdingId: string): void {
    this.router.navigate(['company', 'holding', holdingId]);
  }

  public findOfficesByHolding(holdingId: string): void {
    this.router.navigate(['office', 'holding', holdingId]);
  }

  public findPersonsByHolding(personId: string): void {
    this.router.navigate(['person', 'holding', personId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

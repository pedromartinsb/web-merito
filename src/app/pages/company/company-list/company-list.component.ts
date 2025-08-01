import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HoldingService } from 'src/app/services/holding.service';
import { Holding } from 'src/app/models/holding';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
})
export class CompanyListComponent implements OnInit, AfterViewInit {
  holdingId: string;
  holding: Holding;

  displayedColumns: string[] = [
    'fantasyName',
    'cnpj',
    'offices',
    'persons',
    'actions',
  ];
  dataSource = new MatTableDataSource<Company>();

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private companyService: CompanyService,
    private holdinService: HoldingService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {
    this.isLoading = true;
    this.holdingId = this.route.snapshot.params['holdingId'];
  }

  ngOnInit(): void {
    if (!this.holdingId) {
      this.findAll();
    } else {
      this.findAllByHolding();
      this.findHoldingById();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private findAll(): void {
    this.companyService.findAll().subscribe((response) => {
      this.dataSource = new MatTableDataSource<Company>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  private findAllByHolding(): void {
    this.companyService
      .findAllByHolding(this.holdingId)
      .subscribe((response) => {
        this.dataSource = new MatTableDataSource<Company>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findHoldingById(): void {
    this.holdinService.findById(this.holdingId).subscribe((response) => {
      this.holding = response;
    });
  }

  public findOfficesByCompany(companyId: string): void {
    this.router.navigate(['office', 'company', companyId]);
  }

  public findPersonsByCompany(companyId: string): void {
    this.router.navigate(['person', 'company', companyId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCompanyTypeLabel(companyType: any): string {
    if (companyType == 'HEADQUARTERS') {
      return 'MATRIZ';
    } else if (companyType == 'FILIAL') {
      return 'FILIAL';
    } else {
      return 'NENHUMA';
    }
  }

  editCompany(companyId: string): void {
    this.router.navigate(['company', 'edit', companyId]);
  }

  openDeleteConfirmationModal(companyId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar esta empresa?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteCompany(companyId);
      dialogRef.close();
      this.toast.success('Empresa deletada com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteCompany(companyId: string): void {
    this.companyService.delete(companyId).subscribe(() => {
      this.findAll();
    });
  }
}

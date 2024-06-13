import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../../components/delete/delete-confirmation-modal';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HoldingService } from 'src/app/services/holding.service';
import { Holding } from 'src/app/models/holding';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  holdingId: string;
  holding: Holding;

  ELEMENT_DATA: Company[] = [];
  FILTERED_DATA: Company[] = [];

  displayedColumns: string[] = [
    'fantasyName',
    'cnpj',
    'offices',
    'persons',
    'actions',
  ];
  dataSource = new MatTableDataSource<Company>(this.ELEMENT_DATA);

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private holdinService: HoldingService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.holdingId = this.route.snapshot.params['holdingId'];
    if (this.holdingId) {
      this.findAllByHolding();
      this.findHoldingById();
    } else {
      this.findAll();
    }
    this.isLoading = true;
  }

  private findAll(): void {
    this.companyService.findAll().subscribe((response) => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Company>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  private findAllByHolding(): void {
    this.companyService
      .findAllByHolding(this.holdingId)
      .subscribe((response) => {
        this.ELEMENT_DATA = response;
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { Company } from 'src/app/models/company';
import { Holding } from 'src/app/models/holding';
import { Office } from 'src/app/models/office';
import { CompanyService } from 'src/app/services/company.service';
import { OfficeService } from 'src/app/services/office.service';

@Component({
  selector: 'app-office-list',
  templateUrl: './office-list.component.html',
  styleUrls: ['./office-list.component.css'],
})
export class OfficeListComponent implements OnInit {
  companyId: string;
  holdingId: string;
  company: Company;
  holding: Holding;

  ELEMENT_DATA: Office[] = [];
  FILTERED_DATA: Office[] = [];

  displayedColumns: string[] = ['fantasyName', 'cnpj', 'persons', 'actions'];
  dataSource = new MatTableDataSource<Office>(this.ELEMENT_DATA);

  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private officeService: OfficeService,
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.holdingId = this.route.snapshot.params['holdingId'];
    this.companyId = this.route.snapshot.params['companyId'];
    if (this.holdingId) {
      this.findAllByHolding();
    } else if (this.companyId) {
      this.findAllByCompany();
      this.findCompanyById();
    } else {
      this.findAll();
    }
    this.isLoading = true;
  }

  private findAll(): void {
    this.officeService.findAll().subscribe((response) => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Office>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  private findAllByHolding(): void {
    this.officeService
      .findAllByHolding(this.holdingId)
      .subscribe((response) => {
        this.ELEMENT_DATA = response;
        this.dataSource = new MatTableDataSource<Office>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findAllByCompany(): void {
    this.officeService
      .findAllByCompany(this.companyId)
      .subscribe((response) => {
        this.ELEMENT_DATA = response;
        this.dataSource = new MatTableDataSource<Office>(response);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      });
  }

  private findCompanyById(): void {
    this.companyService.findById(this.companyId).subscribe((response) => {
      this.company = response;
    });
  }

  public findPersonsByOffice(officeId: string): void {
    this.router.navigate(['person', 'office', officeId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editOffice(officeId: string): void {
    this.router.navigate(['office', 'edit', officeId]);
  }

  openDeleteConfirmationModal(officeId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message =
      'Tem certeza que deseja deletar esta unidade?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteOffice(officeId);
      dialogRef.close();
      this.toast.success('Unidade deletada com sucesso', 'Excluir');
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  deleteOffice(officeId: string): void {
    this.officeService.delete(officeId).subscribe(() => {
      this.findAll();
    });
  }
}

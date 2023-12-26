import { CompanyService } from './../../../services/company.service';
import { Company } from './../../../models/company';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {

  ELEMENT_DATA: Company[] = [];
  FILTERED_DATA: Company[] = [];

  displayedColumns: string[] = ['name', 'companyType', 'holding', 'segment', 'actions'];
  dataSource = new MatTableDataSource<Company>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.companyService.findAll().subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Company>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCompanyTypeLabel(companyType: any): string {
    if(companyType == 'HEADQUARTERS') {
      return 'MATRIZ'
    } else if(companyType == 'FILIAL') {
      return 'FILIAL'
    } else {
      return 'NENHUMA'
    }
  }

  editCompany(companyId: string): void {    
    this.router.navigate(['company', 'edit', companyId]);
  }

  openDeleteConfirmationModal(companyId: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);
    
    dialogRef.componentInstance.message = 'Tem certeza que deseja deletar esta empresa?';

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteCompany(companyId);

      dialogRef.close();
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationModalComponent } from 'src/app/components/delete/delete-confirmation-modal';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  displayedColumns: string[] = ['picture', 'name', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Document>();

  s3Url = 'https://sistema-merito.s3.amazonaws.com/';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public isLoading: boolean = false;

  constructor(
    private documentService: DocumentService,
    private dialog: MatDialog,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.isLoading = true;
    this.documentService.findAll().subscribe((response) => {
      console.log(response.length);
      response.forEach((r) => {
        if (r.key != null) {
          r.picture = this.s3Url + r.key;
        }
      });
      this.dataSource = new MatTableDataSource<Document>(response);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadFile(key: string) {
    const url = this.s3Url + key;
    const a = document.createElement('a');
    a.href = url;
    a.download = key;
    document.body.appendChild(a);
    a.target = '_blank';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public edit(key: string) {
    this.router.navigate(['document', 'edit', key]);
  }

  public openDeleteConfirmationModal(key: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationModalComponent);

    dialogRef.componentInstance.message = `Tem certeza que deseja deletar o arquivo ${key}?`;

    dialogRef.componentInstance.deleteConfirmed.subscribe(() => {
      this.deleteFile(key);
      dialogRef.close();
    });

    dialogRef.componentInstance.deleteCanceled.subscribe(() => {
      dialogRef.close();
    });
  }

  public deleteFile(key: string) {
    this.documentService.deleteFile(key).subscribe(() => {
      this.toast.success('Arquivo deletado com sucesso', 'Excluir');
      this.findAll();
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from 'src/app/models/document';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];

  ELEMENT_DATA: Document[] = [];
  FILTERED_DATA: Document[] = [];

  displayedColumns: string[] = [
    'name',
    'responsibility',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Document>(this.documents);

  s3Url = 'https://sistema-merito.s3.amazonaws.com/';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public isLoading: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.isLoading = true;
    this.documentService.findAll().subscribe((response) => {
      this.documents = response;
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
}

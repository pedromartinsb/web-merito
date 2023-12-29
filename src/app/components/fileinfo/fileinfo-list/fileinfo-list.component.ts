import { FileinfoService } from './../../../services/fileinfo.service';
import { MatTableDataSource } from '@angular/material/table';
import { Fileinfo } from './../../../models/fileinfo';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';

@Component({
  selector: 'app-fileinfo-list',
  templateUrl: './fileinfo-list.component.html',
  styleUrls: ['./fileinfo-list.component.css']
})
export class FileinfoListComponent implements OnInit {

  fileinfos: Fileinfo[] = [];

  ELEMENT_DATA: Fileinfo[] = [];
  FILTERED_DATA: Fileinfo[] = [];

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<Fileinfo>(this.fileinfos);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fileinfoService: FileinfoService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.fileinfoService.findAll().subscribe(response => {
      this.fileinfos = response;
      this.dataSource = new MatTableDataSource<Fileinfo>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadFile(url: string, fileName: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

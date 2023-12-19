import { ResponsibilityService } from './../../../services/responsibility.service';
import { Responsibility } from './../../../models/responsibility';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-responsibility-list',
  templateUrl: './responsibility-list.component.html',
  styleUrls: ['./responsibility-list.component.css']
})
export class ResponsibilityListComponent implements OnInit {

  ELEMENT_DATA: Responsibility[] = [];
  FILTERED_DATA: Responsibility[] = [];

  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Responsibility>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private responsibilityService: ResponsibilityService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.responsibilityService.findAll().subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Responsibility>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

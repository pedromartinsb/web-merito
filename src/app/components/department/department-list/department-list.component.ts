import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Department } from './../../../models/department';
import { DepartmentService } from './../../../services/department.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {

  ELEMENT_DATA: Department[] = [];
  FILTERED_DATA: Department[] = [];

  displayedColumns: string[] = ['name', 'acoes'];
  dataSource = new MatTableDataSource<Department>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.findAllByCompany(this.route.snapshot.paramMap.get('idCompany'));
  }

  findAllByCompany(idCompany: string): void {
    this.departmentService.findAllByCompany(idCompany).subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Department>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

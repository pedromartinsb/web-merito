import { PersonService } from './../../../services/person.service';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from './../../../models/person';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  persons: Person[] = [];

  displayedColumns: string[] = ["name", "cpf", "email", "personType"];
  dataSource = new MatTableDataSource<Person>(this.persons);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
      this.dataSource = new MatTableDataSource<Person>(response);
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

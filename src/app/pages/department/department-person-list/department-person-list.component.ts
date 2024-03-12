import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Address, Company, CompanyType, Contact } from 'src/app/models/company';
import { Department } from 'src/app/models/department';
import { Person } from 'src/app/models/person';
import { DepartmentService } from 'src/app/services/department.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-department-person-list',
  templateUrl: './department-person-list.component.html',
  styleUrls: ['./department-person-list.component.css']
})
export class DepartmentPersonListComponent implements OnInit {

  department: Department = {
    id: '',
    name: '',
    company: null,
    companyId: '',
    person: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: ''
  };

  address: Address = {
    cep: '',
    streetName: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: '',
  };

  contact: Contact = {
    phone: '',
    cellphone: '',
  };

  company: Company = {
    fantasyName: '',
    corporateReason: '',
    cnpj: '',
    email: '',
    website: '',
    contact: this.contact,
    address: this.address,
    companyType: 'HEADQUARTERS',
    holdingId: '',
    holding: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  ELEMENT_DATA: Person[] = [];
  FILTERED_DATA: Person[] = [];

  displayedColumns: string[] = ['name', 'acoes'];
  dataSource = new MatTableDataSource<Person>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private route: ActivatedRoute,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.findAllPersonByCompany(this.route.snapshot.paramMap.get('idCompany'));
  }

  findAllPersonByCompany(idCompany: string): void {
    this.personService.findAllByCompany(idCompany).subscribe(response => {
      this.ELEMENT_DATA = response;
      this.dataSource = new MatTableDataSource<Person>(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

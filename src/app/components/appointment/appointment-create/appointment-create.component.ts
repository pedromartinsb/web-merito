import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company';
import { Department } from 'src/app/models/department';
import { Person } from 'src/app/models/person';
import { Sector } from 'src/app/models/sector';
import { CompanyService } from 'src/app/services/company.service';
import { DepartmentService } from 'src/app/services/department.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit {

  companyId:    string = '';
  departmentId: string = '';
  sectorId:     string = '';
  personId:     string = '';

  companies:   Company[] = [];
  departments: Department[] = [];
  sectors:     Sector[] = [];
  persons:     Person[] = [];

  company:    FormControl = new FormControl(null, [Validators.required]);
  department: FormControl = new FormControl(null, [Validators.required]);
  sector:     FormControl = new FormControl(null, [Validators.required]);
  person:     FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private personService: PersonService,
    private router: Router,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.findAllCompanies();
  }

  findAllCompanies(): void {
    this.companyService.findAll().subscribe(response => {
      if (response.values != null) {
        this.toast.success('Unidades listadas com sucesso');
        this.companies = response;
        this.findAllDepartments();
      }
    });
  }

  findAllDepartments(): void {
    this.departmentService.findAll().subscribe(response => {
      if (response.values != null) {
        this.toast.success('Departamentos listados com sucesso');
        this.departments = response;
        this.findAllPersons();
      }
    });
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      if (response.values != null) {
        this.toast.success('Colaboradores listados com sucesso');
        this.persons = response;
      }
    });
  }

}

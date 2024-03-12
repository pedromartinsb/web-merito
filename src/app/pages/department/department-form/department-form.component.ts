import { DepartmentService } from '../../../services/department.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HoldingService } from '../../../services/holding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from '../../../models/holding';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Department } from 'src/app/models/department';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { Company } from 'src/app/models/company';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {

  companies: Company[] = [];

  department: Department = {
    name: '',
    company: null,
    companyId: '',
    person: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  isCompanyLinkedCreation: boolean = false;

  departmentId: string;
  companyId: string;

  departmentCompany: Company;

  name: FormControl = new FormControl(null, Validators.minLength(3));
  company: FormControl = new FormControl(null, Validators.required);

  PERSON_ELEMENT_DATA: Person[] = [];
  PERSON_FILTERED_DATA: Person[] = [];

  departmentPersons: Person[] = [];

  newLinkedPerson: Person;

  personDisplayedColumns: string[] = ['personName', 'personDepartment', 'personType', 'personActions'];
  personDataSource = new MatTableDataSource<Person>(this.departmentPersons);

  public isSaving: boolean = false;

  @ViewChild('personPaginator') personPaginator: MatPaginator;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private personService: PersonService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.params['id'];
    this.companyId = this.route.snapshot.params['idCompany'];
    this.department.companyId = this.companyId;

    if (this.departmentId) {
      this.loadDepartment();
    }
    if (this.companyId) {
      this.isCompanyLinkedCreation = true;
      this.findDepartmentCompany();
    } else {
      this.findAllCompanies();
      this.company.setValue(null);
    }
  }

  ngAfterViewInit(): void {
    if (this.personPaginator) {
      this.personDataSource.paginator = this.personPaginator;
    }
  }

  openDepartmentForm(): void {
    if (this.departmentId) {
      this.updateDepartment();
    } else {
      this.createDepartment();
    }
  }

  private createDepartment(): void {
    this.isSaving = true;
    this.departmentService.create(this.department).subscribe({
      next: () => {
        this.toast.success('Departamento cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['department']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateDepartment(): void {
    this.isSaving = true;
    this.departmentService.update(this.departmentId, this.department).subscribe({
      next: () => {
        this.toast.success('Departamento atualizado com sucesso', 'Atualização');
        this.router.navigate(['department']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  findAllCompanies(): void {
    this.companyService.findAll().subscribe((response: Company[]) => {
      this.companies = response;
    });
  }

  findDepartmentCompany(): void {
    this.companyService.findById(this.companyId).subscribe((response: Company) => {
      this.department.company = response;
      this.company.patchValue(response);
    });
  }

  loadDepartment(): void {
    this.departmentService.findById(this.departmentId).pipe(
      finalize(() => {
        this.findDepartmentPersons();
        this.company.patchValue(this.department.company.id);
      })
    ).subscribe((response: Department) => {
      this.department = response;
      this.company.patchValue(this.department.company.id);
    });
  }

  findDepartmentPersons() {
    if (this.department.person && this.department.person.length > 0 ) this.departmentPersons = this.department.person;
    this.personDataSource = new MatTableDataSource<Person>(this.department.person);
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach(element => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid && this.company.valid;
  }

  getPersonTypeLabel(personType: string) {
    if (personType === 'EMPLOYEE') {
      return 'Colaborador';
    }
    return '';
  }

  selectCompany() {
    if (this.company.value) {
      let company: string = this.company.value;
      this.companyId = company;
      this.department.companyId = company;
    }
  }

}

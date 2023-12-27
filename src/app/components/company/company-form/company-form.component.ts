import { CompanyService } from '../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HoldingService } from '../../../services/holding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from '../../../models/holding';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Company, CompanyType } from 'src/app/models/company';
import { finalize } from 'rxjs';
import { Person } from 'src/app/models/person';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DeleteConfirmationModalComponent } from '../../delete/delete-confirmation-modal';
import { DepartmentService } from 'src/app/services/department.service';
import { PersonService } from 'src/app/services/person.service';
import { Department } from 'src/app/models/department';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit {

  holdings: Holding[] = [];

  company: Company = {
    name: '',
    companyType: 'HEADQUARTERS',
    holdingId: '',
    holding: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  companyId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  holding:     FormControl = new FormControl(null, [Validators.required]);
  companyType: FormControl = new FormControl(null, [Validators.required]);

  companyTypeLabels = [
    {label: "Matriz", value: "HEADQUARTERS"},
    {label: "Filial", value: "FILIAL"},
  ];

  PERSON_ELEMENT_DATA: Person[] = [];
  PERSON_FILTERED_DATA: Person[] = [];

  persons: Person[] = [];
  companyPersons: Person[] = [];

  personDisplayedColumns: string[] = ['personName', 'personDepartment', 'personType', 'personActions'];
  personDataSource = new MatTableDataSource<Person>(this.persons);

  DEPARTMENT_ELEMENT_DATA: Person[] = [];
  DEPARTMENT_FILTERED_DATA: Person[] = [];

  departments: Department[] = [];
  companyDepartments: Department[] = [];

  newLinkedDepartment: Department;

  departmentDisplayedColumns: string[] = ['departmentName', 'departmentActions'];
  departmentDataSource = new MatTableDataSource<Department>(this.departments);

  @ViewChild('personPaginator') personPaginator: MatPaginator;
  @ViewChild('departmentPaginator') departmentPaginator: MatPaginator;  

  constructor(
    private companyService: CompanyService,
    private holdingService: HoldingService,
    private personService: PersonService,
    private departmentService: DepartmentService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
  ) { }

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params['id'];
    if (this.companyId) {
      this.loadCompany();
    } else {
      this.loadList();
    }
  }

  ngAfterViewInit(): void {
    if (this.personPaginator) {
      this.personDataSource.paginator = this.personPaginator;
    }
    if (this.departmentPaginator) {
      this.departmentDataSource.paginator = this.departmentPaginator;
    }
  }

  loadList() {
    this.findAllHolding();
    this.findAllPersons();
  }

  findAllHolding(): void {
    this.holdingService.findAll().subscribe((response: Holding[]) => {
      this.holdings = response;
      if(this.companyId) {
        this.holding.setValue(response.find(h => h.id === this.company.holding.id));
        this.company.holdingId = this.company.holding.id;
      }
    });    
  }

  loadCompany(): void {
    this.companyService.findById(this.companyId).pipe(
      finalize(() => {
        this.findAllHolding();
        this.findCompanyPersons();
        this.findCompanyDepartments();
        this.companyType.setValue(this.company.companyType);
      })
    ).subscribe((response: Company) => {
      this.company = response;       
    });
  }

  openCompanyForm(): void {
    if (this.companyId) {
      this.updateCompany();
    } else {
      this.createCompany();
    }
  }
  
  private createCompany(): void {
    this.companyService.create(this.company).subscribe({
      next: () => {
        this.toast.success('Empresa cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['company']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateCompany(): void {
    this.companyService.update(this.companyId, this.company).subscribe({
      next: () => {
        this.toast.success('Empresa atualizada com sucesso', 'Atualização');
        this.router.navigate(['company']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
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
    return this.name.valid;
  }

  selectHolding() {
    if (this.company.holding && this.company.holding.id) this.company.holdingId = this.company.holding.id;
  }

  findCompanyPersons() {
    this.departmentService.findAllPersonByCompany(this.company.id).subscribe((response: Person[]) => {
      this.companyPersons = response;
      this.personDataSource = new MatTableDataSource<Person>(response);
    });
  }

  findCompanyDepartments() {
    this.departmentService.findAllByCompany(this.company.id).subscribe((response: Department[]) => {
      this.companyDepartments = response;
      this.departmentDataSource = new MatTableDataSource<Department>(response);
    });
  }

  findAllPersons() {    
    this.departmentService.findAllPersonByCompany(this.company.id).subscribe((response: Person[]) => {
      this.persons = response;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.personDataSource.filter = filterValue.trim().toLowerCase();
  }

  getPersonTypeLabel(personType: string) {
    if (personType === 'EMPLOYEE') {
      return 'Colaborador';
    }
    return '';
  }

}

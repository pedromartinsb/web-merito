import { DepartmentService } from '../../../services/department.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { HoldingService } from '../../../services/holding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Holding } from '../../../models/holding';
import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/models/department';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {

  persons: Person[] = [];

  department: Department = {
    name: '',
    companyId: '',
    person: null,
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  departmentId: string;
  companyId: string;

  name:        FormControl = new FormControl(null, Validators.minLength(3));
  person:     FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.params['id'];
    this.companyId = this.route.snapshot.params['idCompany'];
    this.department.companyId = this.companyId;
    if (this.departmentId) {
      this.loadDepartment();
    }
    this.findAllPersons();
  }

  openDepartmentForm(): void {
    if (this.departmentId) {
      this.updateDepartment();
    } else {
      this.createDepartment();
    }
  }
  
  private createDepartment(): void {
    this.departmentService.create(this.department).subscribe({
      next: () => {
        this.toast.success('Departamento cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateDepartment(): void {
    this.departmentService.update(this.departmentId, this.department).subscribe({
      next: () => {
        this.toast.success('Departamento atualizado com sucesso', 'Atualização');
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  findAllPersons(): void {
    this.personService.findAll().subscribe(response => {
      this.persons = response;
    });    
  }

  loadDepartment(): void {    
    this.departmentService.findById(this.departmentId).subscribe((response: Department) => {
      this.department = response;
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

}

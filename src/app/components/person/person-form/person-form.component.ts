import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Person, User, Address, Roles } from 'src/app/models/person';
import { TaskService } from 'src/app/services/task.service';
import { RoutineService } from 'src/app/services/routine.service';
import { Routine } from 'src/app/models/routine';
import { Task } from 'src/app/models/task';
import { DepartmentService } from 'src/app/services/department.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { Department } from 'src/app/models/department';
import { Responsibility } from 'src/app/models/responsibility';
import { finalize } from 'rxjs';
import { Role } from 'src/app/models/role';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company';
import { MatTableDataSource } from '@angular/material/table';
import { Assignment } from 'src/app/models/assignment';
import { MatPaginator } from '@angular/material/paginator';
import { AssignmentService } from 'src/app/services/assignment.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  roles: Roles[] = [];
  companies: Company[] = [];
  departments: Department[] = [];
  responsibilities: Responsibility[] = [];

  user: User = {
    username: '',
    email: '',
    roles: null,
    password: ''
  }

  address: Address = {
    cep: '',
    streetName: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: ''
  }

  person: Person = {
    name: '',
    cpf: '',
    personType: 'EMPLOYEE',

    department: null,
    departmentId: '',
    responsibility: null,
    responsibilityId: '',
    company: null,
    companyId: '',

    user: this.user,
    address: this.address,

    tasks: null, 
    routines: null, 
    assignments: null,

    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  }

  roleLabels = [
    {label: "Usuário", value: {name: "ROLE_USERS"}},
    {label: "Admin", value: {name: "ROLE_ADMIN"}},
    {label: "Moderador", value: {name: "ROLE_MODERADOR"}}
  ];

  personId: string;
  companyId: string;

  personCompany: Company;
  
  name: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);
  
  company: FormControl = new FormControl(null, Validators.required);
  department: FormControl = new FormControl(null, Validators.required);
  responsibility: FormControl = new FormControl(null, Validators.required);

  username: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl(null, Validators.email);
  password: FormControl = new FormControl(null, []);
  role: FormControl = new FormControl(null, Validators.minLength(1));

  cep: FormControl = new FormControl(null, Validators.minLength(3));
  streetName: FormControl = new FormControl(null, Validators.minLength(3));
  neighborhood: FormControl = new FormControl(null, Validators.minLength(3));
  city: FormControl = new FormControl(null, Validators.minLength(3));
  uf: FormControl = new FormControl(null, Validators.minLength(3));
  complement: FormControl = new FormControl(null, Validators.minLength(3));

  task:     FormControl = new FormControl(null, []);
  routine:     FormControl = new FormControl(null, []);

  isCompanyLinkedCreation: boolean = false;

  ROUTINE_ELEMENT_DATA: Routine[] = [];
  ROUTINE_FILTERED_DATA: Routine[] = [];

  routines: Routine[] = [];
  personRoutines: Routine[] = [];

  routineDisplayedColumns: string[] = ['routineName', 'routineActions'];
  routineDataSource = new MatTableDataSource<Routine>(this.routines);

  TASK_ELEMENT_DATA: Task[] = [];
  TASK_FILTERED_DATA: Task[] = [];

  tasks: Task[] = [];
  personTasks: Task[] = [];

  taskDisplayedColumns: string[] = ['taskName', 'taskActions'];
  taskDataSource = new MatTableDataSource<Task>(this.tasks);

  ASSIGNMENT_ELEMENT_DATA: Assignment[] = [];
  ASSIGNMENT_FILTERED_DATA: Assignment[] = [];

  assignments: Assignment[] = [];
  personAssignments: Assignment[] = [];

  assignmentDisplayedColumns: string[] = ['assignmentName', 'assignmentDepartment', 'assignmentType', 'assignmentActions'];
  assignmentDataSource = new MatTableDataSource<Assignment>(this.assignments);

  @ViewChild('routinePaginator') routinePaginator: MatPaginator;
  @ViewChild('taskPaginator') taskPaginator: MatPaginator;
  @ViewChild('assignmentPaginator') assignmentPaginator: MatPaginator;


  constructor(
    private personService: PersonService,
    private companyService: CompanyService,
    private toast: ToastrService,
    private router: Router,    
    private route: ActivatedRoute,
    private taskService: TaskService,
    private routineService: RoutineService,
    private assignmentService: AssignmentService,
    private departmentService: DepartmentService,
    private responsibilityService: ResponsibilityService
  ) { }

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    this.companyId = this.route.snapshot.params['idCompany'];    
    if (this.personId) {
      this.loadPerson();
    } else {
      this.loadList();
    }
    if (this.companyId) {
      this.loadCompany();
      this.isCompanyLinkedCreation = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.routinePaginator) {
      this.routineDataSource.paginator = this.routinePaginator;
    }
    if (this.taskPaginator) {
      this.taskDataSource.paginator = this.taskPaginator;
    }
    if (this.assignmentPaginator) {
      this.assignmentDataSource.paginator = this.assignmentPaginator;
    }
  }

  loadList() {
    if (this.companyId) {
      this.findAllDepartments(this.companyId);
    } else {
      this.findAllCompanies();
    }
    this.findAllResponsibilities();
    this.findAllTasks();
    this.findAllRoutines();
    this.loadRoles();
  }

  findAllCompanies(): void {
    this.companyService.findAll().subscribe((response: Company[]) => {
      this.companies = response;
    });
  }

  findAllDepartments(companyId: string): void {
    this.departmentService.findAllByCompany(companyId).subscribe((response: Department[]) => {
      this.departments = response;
      if (this.personId) {
        this.department.setValue(response.find(d => d.id === this.person.department.id))
        this.person.departmentId = this.person.department.id;
      }
    });
  }

  findAllResponsibilities(): void {
    this.responsibilityService.findAll().subscribe((response: Responsibility[]) => {
      this.responsibilities = response;
      if (this.personId) {
        this.responsibility.setValue(response.find(p => p.id === this.person.responsibility.id));
        this.person.responsibilityId = this.person.responsibility.id;
      }
    });
  }

  findAllTasks(): void {
    this.taskService.findAll().subscribe(response => {
      this.tasks = response;
    });
  }

  findAllRoutines(): void {
    this.routineService.findAll().subscribe(response => {
      this.routines = response;
    });
  }

  loadRoles(): void {
    if (this.person.user.roles) {
      let selectedRoles: any[];
      this.person.user.roles.forEach(role => {
        this.roleLabels.forEach(label => {
          if (role.name === label.value.name) {
            selectedRoles.push(label);
          }
        });
      });
      this.role.setValue(selectedRoles)
    }
  }

  loadPerson(): void {
    this.personService.findById(this.personId).pipe(
      finalize(() => {
        this.loadList();        
        this.findPersonRoutines();
        this.findPersonTasks();
        this.findPersonAssignments();
      })
    ).subscribe(response => {
      this.person = response;
    });
  }

  findPersonRoutines() {
    this.routineService.findAllByPerson(this.person.id).subscribe((response: Routine[]) => {
      this.personRoutines = response;
      this.routineDataSource = new MatTableDataSource<Routine>(response);
    });
  }

  findPersonTasks() {
    this.taskService.findAllByPerson(this.person.id).subscribe((response: Task[]) => {
      this.personTasks = response;
      this.taskDataSource = new MatTableDataSource<Task>(response);
    });
  }

  findPersonAssignments() {
    this.assignmentService.findAllByPerson(this.person.id).subscribe((response: Assignment[]) => {
      this.personAssignments = response;
      this.assignmentDataSource = new MatTableDataSource<Assignment>(response);
    });
  }

  loadCompany(): void {    
    this.companyService.findById(this.companyId).subscribe((response: Company) => {      
      this.company.setValue(response);
    });
  }


  openPersonForm(): void {
    if (this.personId) {
      this.updatePerson();
    } else {
      this.createPerson();
    }
  }

  private createPerson(): void {
    this.personService.create(this.person).subscribe({
      next: () => {
        this.toast.success('Colaborador cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['person']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updatePerson(): void {
    this.person.department = null;
    this.person.responsibility = null;
    this.personService.update(this.person.id, this.person).subscribe({
      next: () => {
        this.toast.success('Colaborador atualizado com sucesso', 'Atualização');
        this.router.navigate(['person']);
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  addPersonType(personTypeRequest: any): void {
    this.person.personType = personTypeRequest;
  }

  addRole(role: any): void {
    if (this.person.user.roles.includes(role)) {
      this.person.user.roles.splice(this.person.user.roles.indexOf(role), 1);
    } else {
      this.person.user.roles.push(role);
    }
  }

  validateFields(): boolean {
    return this.name.valid && this.cpf.valid
      && this.email.valid && this.password.valid
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

  getRoleLabel(value: string): string | undefined {
    const matchingRole = this.roleLabels.find(role => role.value.name === value);
    return matchingRole ? matchingRole.label : undefined;
  }

  selectCompany() {   
    if (this.company.value) {
      let company: Company = this.company.value;
      this.companyId = company.id;
      this.findAllDepartments(company.id);
    }
  }

}

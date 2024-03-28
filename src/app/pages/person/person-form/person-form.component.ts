import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Person,
  User,
  Address,
  Roles,
  AddressSearch,
  Contact,
} from 'src/app/models/person';
import { TaskService } from 'src/app/services/task.service';
import { RoutineService } from 'src/app/services/routine.service';
import { Routine } from 'src/app/models/routine';
import { Task } from 'src/app/models/task';
import { DepartmentService } from 'src/app/services/department.service';
import { ResponsibilityService } from 'src/app/services/responsibility.service';
import { Department } from 'src/app/models/department';
import { Responsibility } from 'src/app/models/responsibility';
import { Subscription, finalize } from 'rxjs';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/models/company';
import { MatTableDataSource } from '@angular/material/table';
import { Assignment } from 'src/app/models/assignment';
import { MatPaginator } from '@angular/material/paginator';
import { AssignmentService } from 'src/app/services/assignment.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css'],
})
export class PersonFormComponent implements OnInit, AfterViewInit, OnDestroy {
  roles: Roles[] = [];
  companies: Company[] = [];
  departments: Department[] = [];
  responsibilities: Responsibility[] = [];

  user: User = {
    username: '',
    email: '',
    roles: null,
    password: '',
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

  person: Person = {
    name: '',
    cpfCnpj: '',
    personType: 'EMPLOYEE',
    gender: 'Male',
    contractType: 'CLT',

    department: null,
    departmentId: '',
    responsibility: null,
    responsibilityId: '',
    company: null,
    companyId: '',

    user: this.user,
    address: this.address,
    contact: this.contact,

    tasks: null,
    routines: null,
    assignments: null,

    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  roleLabels = [
    { label: 'Usuário', value: { name: 'ROLE_USER' } },
    { label: 'Admin', value: { name: 'ROLE_ADMIN' } },
    { label: 'Moderador', value: { name: 'ROLE_MODERATOR' } },
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

  // Contact
  phone: FormControl = new FormControl();
  cellphone: FormControl = new FormControl();

  // Address
  cep: FormControl = new FormControl(null, Validators.minLength(3));
  streetName: FormControl = new FormControl(null, Validators.minLength(3));
  neighborhood: FormControl = new FormControl(null, Validators.minLength(3));
  city: FormControl = new FormControl(null, Validators.minLength(3));
  uf: FormControl = new FormControl(null, Validators.minLength(3));
  complement: FormControl = new FormControl(null, Validators.minLength(3));

  task: FormControl = new FormControl(null, []);
  routine: FormControl = new FormControl(null, []);

  isCompanyLinkedCreation: boolean = false;

  public isSaving: boolean = false;

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

  taskDisplayedColumns: string[] = [
    'taskName',
    'taskStartDate',
    'taskEndDate',
    'taskActions',
  ];
  taskDataSource = new MatTableDataSource<Task>(this.tasks);

  ASSIGNMENT_ELEMENT_DATA: Assignment[] = [];
  ASSIGNMENT_FILTERED_DATA: Assignment[] = [];

  assignments: Assignment[] = [];
  personAssignments: Assignment[] = [];

  isCpf: boolean = true;
  contractType: string = '';

  assignmentDisplayedColumns: string[] = [
    'assignmentName',
    'assignmentStartDate',
    'assignmentEndDate',
    'assignmentActions',
  ];
  assignmentDataSource = new MatTableDataSource<Assignment>(this.assignments);

  private cepValueChangesSubscription: Subscription;

  public radioContractTypeOptions: string = 'CLT';
  public radioGenderOptions: string = 'Male';
  public hide: boolean = true;
  get passwordInput() {
    return this.password;
  }

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
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    this.companyId = this.route.snapshot.params['idCompany'];
    if (this.personId) {
      this.loadPerson();
    } else {
      this.loadList();
    }
    this.cepValueChangesSubscription = this.cep.valueChanges.subscribe(
      (newCep: string) => {
        if (newCep && newCep.length === 8) {
          this.findAddress();
        }
      }
    );
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

  ngOnDestroy(): void {
    if (this.cepValueChangesSubscription) {
      this.cepValueChangesSubscription.unsubscribe();
    }
  }

  loadList() {
    if (this.companyId) {
      this.findAllDepartments(this.companyId);
      this.loadCompany();
      this.isCompanyLinkedCreation = true;
    } else {
      this.findAllCompanies();
    }
    this.findAllResponsibilities();
    this.findAllTasks();
    this.findAllRoutines();
    this.findAllAssignments();
    this.loadRoles();
  }

  findAllCompanies(): void {
    this.companyService
      .findAll()
      .pipe(
        finalize(() => {
          if (this.personId) this.setCompanyAndDepartment();
        })
      )
      .subscribe((response: Company[]) => {
        this.companies = response;
      });
  }

  findAllDepartments(companyId: string): void {
    this.departmentService
      .findAllByCompany(companyId)
      .subscribe((response: Department[]) => {
        this.departments = response;
      });
  }

  setCompanyAndDepartment(): void {
    this.company.setValue(this.person.department.company.id);
    this.person.companyId = this.person.department.company.id;
    this.companyId = this.person.department.company.id;
    this.department.setValue(this.person.department.id);
    this.person.departmentId = this.person.department.id;
  }

  findAllResponsibilities(): void {
    this.responsibilityService
      .findAll()
      .subscribe((response: Responsibility[]) => {
        this.responsibilities = response;
        if (this.personId) {
          this.responsibility.setValue(
            response.find((p) => p.id === this.person.responsibility.id)
          );
          this.person.responsibilityId = this.person.responsibility.id;
        }
      });
  }

  findAllTasks(): void {
    this.taskService.findAll().subscribe((response) => {
      this.tasks = response;
    });
  }

  findAllRoutines(): void {
    this.routineService.findAll().subscribe((response) => {
      this.routines = response;
    });
  }

  findAllAssignments(): void {
    this.assignmentService.findAll().subscribe((response) => {
      this.assignments = response;
    });
  }

  loadPerson(): void {
    this.personService
      .findById(this.personId)
      .pipe(
        finalize(() => {
          this.loadList();
          this.findPersonRoutines();
          this.findPersonTasks();
          this.findPersonAssignments();
        })
      )
      .subscribe((response) => {
        console.log(response['contractType']);
        if (response['contractType'] === 'PROFESSIONAL') {
          response['contractType'] = 'Professional';
          this.radioContractTypeOptions = 'Professional';
          this.isCpf = false;
        }
        if (response['gender'] === 'FEMALE') {
          response['gender'] = 'Female';
          this.radioGenderOptions = 'Female';
        }
        this.person = response;
      });
  }

  findPersonRoutines() {
    this.routineService
      .findAllByPerson(this.person.id)
      .subscribe((response: Routine[]) => {
        this.personRoutines = response;
        this.routineDataSource = new MatTableDataSource<Routine>(response);
        this.routines = this.routines.filter(
          (routine) =>
            !this.personRoutines.some(
              (personRoutine) => personRoutine.id === routine.id
            )
        );
      });
  }

  findPersonTasks() {
    this.taskService
      .findAllByPerson(this.person.id)
      .subscribe((response: Task[]) => {
        this.personTasks = response;
        this.taskDataSource = new MatTableDataSource<Task>(response);
        this.tasks = this.tasks.filter(
          (task) =>
            !this.personTasks.some((personTask) => personTask.id === task.id)
        );
      });
  }

  findPersonAssignments() {
    this.assignmentService
      .findAllByPerson(this.person.id)
      .subscribe((response: Assignment[]) => {
        this.personAssignments = response;
        this.assignmentDataSource = new MatTableDataSource<Assignment>(
          response
        );
        this.assignments = this.assignments.filter(
          (assignment) =>
            !this.personAssignments.some(
              (personAssignment) => personAssignment.id === assignment.id
            )
        );
      });
  }

  loadCompany(): void {
    this.companyService
      .findById(this.companyId)
      .subscribe((response: Company) => {
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
    this.isSaving = true;
    this.personService.create(this.person).subscribe({
      next: () => {
        this.toast.success('Colaborador cadastrado com sucesso', 'Cadastro');
        this.router.navigate(['person']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
        this.isSaving = false;
      },
    });
  }

  private updatePerson(): void {
    this.isSaving = true;
    this.person.department = null;
    this.person.responsibility = null;
    this.personService.update(this.person.id, this.person).subscribe({
      next: () => {
        this.toast.success('Colaborador atualizado com sucesso', 'Atualização');
        this.router.navigate(['person']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  addPersonType(personTypeRequest: any): void {
    this.person.personType = personTypeRequest;
  }

  validateFields(): boolean {
    return (
      this.name.valid &&
      this.cpf.valid &&
      this.email.valid &&
      this.password.valid
    );
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  addRole(role: any): void {
    if (this.person.user.roles.includes(role)) {
      this.person.user.roles.splice(this.person.user.roles.indexOf(role), 1);
    } else {
      this.person.user.roles.push(role);
    }
  }

  loadRoles(): void {
    if (this.person.user.roles) {
      let selectedRoles: any[] = this.roleLabels.filter((roleLabel) =>
        this.person.user.roles.some(
          (userRole) => userRole.name === roleLabel.value.name
        )
      );
      this.role.patchValue(selectedRoles);
    }
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1.name === role2.name;
  }

  getRoleLabel(value: string): string | undefined {
    const matchingRole = this.roleLabels.find(
      (role) => role.value.name === value
    );
    return matchingRole ? matchingRole.label : undefined;
  }

  selectCompany() {
    if (this.company.value) {
      let company: string = this.company.value;
      this.companyId = company;
      this.findAllDepartments(company);
    }
  }

  addRoutinesToPerson(): void {
    let personNewRoutineIds = this.person.routines.map((r) => r.id);
    this.personService
      .addRoutinesToPerson(personNewRoutineIds, this.personId)
      .subscribe({
        next: () => {
          this.toast.success('Rotinas adicionadas com sucesso', 'Atualização');
          this.findPersonRoutines();
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  addTasksToPerson(): void {
    let personNewTaskIds = this.person.tasks.map((t) => t.id);
    this.personService
      .addTasksToPerson(personNewTaskIds, this.personId)
      .subscribe({
        next: () => {
          this.toast.success('Tarefas adicionadas com sucesso', 'Atualização');
          this.findPersonTasks();
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  addAssignmentsToPerson(): void {
    let personNewAssignmentIds = this.person.assignments.map((r) => r.id);
    this.personService
      .addAssignmentsToPerson(personNewAssignmentIds, this.personId)
      .subscribe({
        next: () => {
          this.toast.success(
            'Atribuições adicionadas com sucesso',
            'Atualização'
          );
          this.findPersonAssignments();
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  findAddress() {
    if (this.cep.value.length === 8) {
      this.personService
        .findAddress(this.cep.value)
        .subscribe((response: AddressSearch) => {
          if (response.cep && response.cep.length > 0) {
            this.fillAddress(response);
            this.toast.success(
              'Endereço preenchido com Sucesso',
              'Atualização'
            );
          } else {
            this.toast.error('CEP não encontrado.');
          }
        });
    }
  }

  fillAddress(addressSearch: AddressSearch) {
    const currentCep = this.cep.value;

    let newAddress: Address = {
      cep: currentCep,
      city: addressSearch.localidade,
      complement: addressSearch.complemento,
      neighborhood: addressSearch.bairro,
      streetName: addressSearch.logradouro,
      uf: addressSearch.uf,
    };

    this.city.patchValue(addressSearch.localidade);
    this.complement.patchValue(addressSearch.complemento);
    this.neighborhood.patchValue(addressSearch.bairro);
    this.streetName.patchValue(addressSearch.logradouro);
    this.uf.patchValue(addressSearch.uf);

    this.person.address = newAddress;
  }

  selectContractType(contractType: string): void {
    this.person.contractType = contractType;
    if (contractType === 'CLT') {
      this.isCpf = true;
      this.person.contractType = 'CLT';
    } else if (contractType === 'Professional') {
      this.isCpf = false;
      this.person.contractType = 'Professional';
    }
  }

  selectGender(gender: string): void {
    this.person.gender = gender;
  }
}

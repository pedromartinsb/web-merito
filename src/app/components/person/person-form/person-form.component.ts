import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {

  roles: Roles[] = [];
  tasks: Task[] = [];
  routines: Routine[] = [];  
  departments: Department[] = [];
  responsibilities: Responsibility[] = [];

  user: User = {
    username: '',
    email: '',
    role: [],
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
    personType: 1,

    departmentsId: '',
    responsibilityId: '',

    user: this.user,
    address: this.address,

    tasks: null, 
    taskId: '',
    routines: null, 
    routineId: '',

    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  }

  roleLabels = [
    {label: "Usuário", value: "ROLE_USERS"},
    {label: "Admin", value: "ROLE_ADMIN"},
    {label: "Moderador", value: "ROLE_MODERADOR"}
  ];

  personId: string;

  name: FormControl = new FormControl(null, Validators.minLength(3));
  cpf: FormControl = new FormControl(null, Validators.required);

  department: FormControl = new FormControl(null, Validators.required);
  responsibility: FormControl = new FormControl(null, Validators.required);

  username: FormControl = new FormControl(null, Validators.minLength(3));
  email: FormControl = new FormControl(null, Validators.email);
  password: FormControl = new FormControl(null, Validators.minLength(3));
  role: FormControl = new FormControl(null, Validators.minLength(1));

  cep: FormControl = new FormControl(null, Validators.minLength(3));
  streetName: FormControl = new FormControl(null, Validators.minLength(3));
  neighborhood: FormControl = new FormControl(null, Validators.minLength(3));
  city: FormControl = new FormControl(null, Validators.minLength(3));
  uf: FormControl = new FormControl(null, Validators.minLength(3));
  complement: FormControl = new FormControl(null, Validators.minLength(3));

  task:     FormControl = new FormControl(null, []);
  routine:     FormControl = new FormControl(null, []);

  constructor(
    private personService: PersonService,
    private toast: ToastrService,
    private router: Router,    
    private route: ActivatedRoute,
    private taskService: TaskService,
    private routineService: RoutineService,
    private departmentService: DepartmentService,
    private responsibilityService: ResponsibilityService
  ) { }

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['id'];
    if (this.personId) {
      this.loadPerson();
    }
    this.findAllDepartments();
    this.findAllResponsibilities();
    this.findAllTasks();
    this.findAllRoutines();
  }

  findAllDepartments(): void {
    this.departmentService.findAll().subscribe(response => {
      this.departments = response;
    });
  }

  findAllResponsibilities(): void {
    this.responsibilityService.findAll().subscribe(response => {
      this.responsibilities = response;
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

  loadPerson(): void {
    this.personService.findById(this.personId).subscribe(response => {
      this.person = response;
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
    this.personService.update(this.personId, this.person).subscribe({
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
    if (this.person.user.role.includes(role)) {
      this.person.user.role.splice(this.person.user.role.indexOf(role), 1);
    } else {
      this.person.user.role.push(role);
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
    const matchingRole = this.roleLabels.find(role => role.value === value);
    return matchingRole ? matchingRole.label : undefined;
  }

}

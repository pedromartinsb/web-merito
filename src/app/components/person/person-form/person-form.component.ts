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
import { finalize } from 'rxjs';
import { Role } from 'src/app/models/role';

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

    departments: null,
    departmentsId: '',
    responsibility: null,
    responsibilityId: '',

    user: this.user,
    address: this.address,

    tasks: null, 
    taskId: '',
    routine: null, 
    routineId: '',

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
    } else {
      this.loadList();
    }
  }

  loadList() {
    this.findAllDepartments();
    this.findAllResponsibilities();
    this.findAllTasks();
    this.findAllRoutines();
  }

  findAllDepartments(): void {
    this.departmentService.findAll().subscribe((response: Department[]) => {
      this.departments = response;
      if (this.personId) {
        let tempDepartmentList: Department[];        
        this.departments.forEach(department => {
          tempDepartmentList.push(this.person.departments.find(t => t.id === department.id));
        });
        this.department.setValue(tempDepartmentList);
      }
    });
  }

  findAllResponsibilities(): void {
    this.responsibilityService.findAll().subscribe((response: Responsibility[]) => {
      this.responsibilities = response;
      if (this.personId) {
        this.responsibility.setValue(response.find(s => s.id === this.person.responsibility.id));
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

  loadPerson(): void {
    this.personService.findById(this.personId).pipe(
      finalize(() => {
        this.loadList();
      })
    ).subscribe(response => {
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

}

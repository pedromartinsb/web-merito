import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Assignment } from 'src/app/models/assignment';
import { Company } from 'src/app/models/company';
import { Department } from 'src/app/models/department';
import { Person } from 'src/app/models/person';
import { Routine } from 'src/app/models/routine';
import { Sector } from 'src/app/models/sector';
import { Task } from 'src/app/models/task';
import { AssignmentService } from 'src/app/services/assignment.service';
import { CompanyService } from 'src/app/services/company.service';
import { DepartmentService } from 'src/app/services/department.service';
import { PersonService } from 'src/app/services/person.service';
import { RoutineService } from 'src/app/services/routine.service';
import { TaskService } from 'src/app/services/task.service';
@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit {

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  isSelected: boolean = false;
  companyId:    string;
  departmentId: string = '';
  sectorId:     string = '';
  personId:     string = '';

  companies:   Company[] = [];
  departments: Department[] = [];
  sectors:     Sector[] = [];
  persons:     Person[] = [];

  personRoutines: Routine[] = [];
  personTasks: Task[] = [];
  personAssignments: Assignment[] = [];

  company:    FormControl = new FormControl(null, [Validators.required]);
  department: FormControl = new FormControl(null, []);
  sector:     FormControl = new FormControl(null, []);
  person:     FormControl = new FormControl(null, [Validators.required]);

  floatLabelControl = new FormControl('auto' as FloatLabelType);

  constructor(
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private dialog: MatDialog,    
    private taskService: TaskService,
    private routineService: RoutineService,
    private assignmentService: AssignmentService,
  ) { }

  ngOnInit(): void {
    this.findAllCompanies();
  }

  findAllCompanies(): void {
    this.companyService.findAll().subscribe(response => {
      if (response.values != null) {
        this.toast.success('Unidades carregadas com sucesso');
        this.companies = response;
      }
    });
  }

  findAllDepartments(companyId: string): void {
    this.departmentService.findAllByCompany(companyId).subscribe(response => {
      if (response.values != null) {
        this.toast.success('Departamentos carregados com sucesso');
        this.departments = response;
      }
    });
  }

  findAllPersonByCompany(companyId: string): void {
    this.personService.findAllByCompany(companyId).subscribe(response => {
      if (response.values != null) {
        this.toast.success('Colaboradores carregados com sucesso');
        this.persons = response;
      }
    });
  }

  search(): void {
    if (this.person && this.person.value) {
      this.personRoutines = [];
      this.personTasks = [];
      this.personAssignments = [];
  
      forkJoin([
        this.routineService.findAllByPerson(this.person.value),
        this.taskService.findAllByPerson(this.person.value),
        this.assignmentService.findAllByPerson(this.person.value)
      ]).subscribe({
        next: (results: [Routine[], Task[], Assignment[]]) => {
          const [routines, tasks, assignments] = results;
  
          this.personRoutines = routines;
          this.personTasks = tasks;
          this.personAssignments = assignments;
  
          this.toast.success('Pesquisa realizada com sucesso');
          this.isSelected = true;
        },
        error: (error) => {
          console.error('Error in fetching data:', error);
          this.toast.error('Error occurred during the search');
        }
      });
    } else {
      this.toast.warning('Selecione uma pessoa antes de pesquisar.');
    }
  }

  findPersonRoutines() {
    this.routineService.findAllByPerson(this.person.value.id).subscribe((response: Routine[]) => {
      this.personRoutines = response;
    });
  }

  findPersonTasks() {
    this.taskService.findAllByPerson(this.person.value.id).subscribe((response: Task[]) => {
      this.personTasks = response;
    });
  }

  findPersonAssignments() {
    this.assignmentService.findAllByPerson(this.person.value.id).subscribe((response: Assignment[]) => {
      this.personAssignments = response;
    });
  }

}

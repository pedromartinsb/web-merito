import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
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
import { Tag } from 'src/app/models/tag';
import { Task } from 'src/app/models/task';
import { AssignmentService } from 'src/app/services/assignment.service';
import { CompanyService } from 'src/app/services/company.service';
import { DepartmentService } from 'src/app/services/department.service';
import { PersonService } from 'src/app/services/person.service';
import { RoutineService } from 'src/app/services/routine.service';
import { TagService } from 'src/app/services/tag.service';
import { TaskService } from 'src/app/services/task.service';
import { DescriptionModalComponent } from '../../description/description-modal';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit {

  appointment: Appointment;

  isSelected: boolean = false;
  companyId:    string;
  departmentId: string = '';
  sectorId:     string = '';
  personId:     string = '';

  companies:   Company[] = [];
  departments: Department[] = [];
  sectors:     Sector[] = [];
  persons:     Person[] = [];

  tags: Tag[] = [];

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
    private tagService: TagService,
    private appointmentService: AppointmentService,
  ) { }

  ngOnInit(): void {
    this.findAllCompanies();
    this.findAllTags();
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

  findPersonRoutines(): void {
    this.routineService.findAllByPerson(this.person.value.id).subscribe((response: Routine[]) => {
      this.personRoutines = response;
    });
  }

  findPersonTasks(): void {
    this.taskService.findAllByPerson(this.person.value.id).subscribe((response: Task[]) => {
      this.personTasks = response;
    });
  }

  findPersonAssignments(): void {
    this.assignmentService.findAllByPerson(this.person.value.id).subscribe((response: Assignment[]) => {
      this.personAssignments = response;
    });
  }

  findAllTags() {
    this.tagService.findAll().subscribe((response: Tag[]) => {
      this.tags = response;
      this.fillTagDescription();
    });
  }

  private createAppointment(): void {
    this.appointmentService.create(this.appointment).subscribe({
      next: () => {
        this.toast.success('Avaliação criada com sucesso', 'Cadastro');
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }
  
  private updateAppointment(): void {
    this.appointmentService.update(this.appointment.id, this.appointment).subscribe({
      next: () => {
        this.toast.success('Avaliação atualizada com sucesso', 'Atualização');
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private saveApointment() {
    if (this.appointment.id) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
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

  fillTagDescription(): void {
    this.tags.forEach((tag) => {
      const tagName = tag.name;

      switch (tagName) {
        case "Red":
          tag.description = "Falha Grave";
          tag.class = 'red-appointment';
          break;
        case "Orange":
          tag.description = "Alerta (Erro cometido as vezes)";
          tag.class = 'orange-appointment';
          break;
        case "Yellow":
          tag.description = "Atenção (Corrigir de forma educativa)";
          tag.class = 'yellow-appointment';
          break;
        case "Green":
          tag.description = "Dever cumprido!";
          tag.class = 'green-appointment';
          break;
        case "Blue":
          tag.description = " Ótimo, Parábens, Excelente!";
          tag.class = 'blue-appointment';
          break;
      }
    })
  }

  openDescriptionDialog(activityId: string, activityType: string): void {

    if (!this.appointment.id) {
      this.appointment.description = '';
      this.appointment.justification = '';
    }

    const dialogRef = this.dialog.open(DescriptionModalComponent, {
      data: {
        description: this.appointment.description || '',
        justification: this.appointment.justification || '',
      },
    });
    
    switch (activityType) {
      case "routine":
        this.appointment.routineId = activityId;
        break;
      case "task":
        this.appointment.taskId = activityId;
        break;
      case "assignment":
        this.appointment.assignmentId = activityId;
        break;
    }

    dialogRef.componentInstance.descriptionSave.subscribe((result: { description: string; justification: string }) => {
      
      this.appointment.description = result.description;
      this.appointment.justification = result.justification;
      this.saveApointment();
      dialogRef.close();
    });

    dialogRef.componentInstance.descriptionCancel.subscribe(() => {
      dialogRef.close();
    });
  }

}

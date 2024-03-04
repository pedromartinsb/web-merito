import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin } from 'rxjs';
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
import { Activity, Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})
export class AppointmentCreateComponent implements OnInit {

  appointment: Appointment = {
    id: '',
    name: '',

    person: null,
    personId: '',

    tag: null,
    tagId: '',

    activityType: '',

    description: '',
    justification: '',

    activityId: '',

    createdAt: '',
    updatedAt: '',
    deletedAt: ''
  };

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

  personAppointments: Appointment[] = [];
  personActivities: Activity[] = [];

  personRoutines: Activity[] = [];
  personTasks: Activity[] = [];
  personAssignments: Activity[] = [];

  startDate: Date = new Date();
  endDate: Date = new Date();

  company:    FormControl = new FormControl(null, [Validators.required]);
  department: FormControl = new FormControl(null, []);
  sector:     FormControl = new FormControl(null, []);
  person:     FormControl = new FormControl(null, [Validators.required]);

  floatLabelControl = new FormControl('auto' as FloatLabelType);

  selectedDateMonthly: Date | null;

  colors = ['blue', 'green', 'yellow', 'orange', 'red'];


  constructor(
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private dialog: MatDialog,
    private tagService: TagService,
    private appointmentService: AppointmentService,
    private el: ElementRef
  ) { 
    this.startDate = new Date();
    this.startDate.setUTCHours(0, 0, 0, 0);

    this.endDate = new Date();
    this.endDate.setUTCHours(23, 59, 59, 999);
  }

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
      this.findPersonActivities();
    } else {
      this.toast.warning('Selecione uma pessoa antes de pesquisar.');
    }
  }

  findPersonAppointments(): void {
    this.appointmentService.findByPersonAndDate(this.person.value, this.startDate, this.endDate).pipe(
      finalize(() => {
        this.categorizeActivities();
        this.toast.success('Pesquisa realizada com sucesso.');
        this.isSelected = true;
      })
    ).subscribe((response: Appointment[]) => {
      this.personAppointments = response;
      if (this.personAppointments && this.personAppointments.length > 0) {
        this.personAppointments.forEach((appointment) => {
          this.personActivities.forEach((activity) => {
            if (activity.id === appointment.id) {
              activity.tag = appointment.tag;
              activity.description = appointment.description;
              activity.justification = appointment.justification;
            }
          })
        })
      }
    });
  }

  findPersonActivities(): void {
    this.appointmentService.findActivitiesByPersonAndDate(this.person.value, this.startDate, this.endDate).pipe(
      finalize(() => {
        this.findPersonAppointments();
      })
    ).subscribe((response: Activity[]) => {
      this.personActivities = response;
    });
  }

  categorizeActivities() {
    this.personRoutines = [];
    this.personTasks = [];
    this.personAssignments = [];
    for (const activity of this.personActivities) {
      if (activity.type === "routine") {
        this.personRoutines.push(activity);
      } else if (activity.type === "task") {
        this.personTasks.push(activity);
      } else if (activity.type === "assignment") {
        this.personAssignments.push(activity);
      }
    }
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

  openDescriptionDialog(activity: Activity): void {

    console.log(activity.description);
    console.log(activity.justification);

    const dialogRef = this.dialog.open(DescriptionModalComponent, {
      data: {
        description: activity.description || '',
        justification: activity.justification || '',
      },
    });

    this.appointment.activityId = activity.id;

    dialogRef.componentInstance.descriptionSave.subscribe((result: { description: string; justification: string }) => {
      
      this.appointment.description = result.description;
      this.appointment.justification = result.justification;
      this.appointment.personId = this.person.value;
      this.appointment.tagId = activity.tag.id;
      this.appointment.activityType = activity.type;
      this.saveApointment();
      dialogRef.close();
    });

    dialogRef.componentInstance.descriptionCancel.subscribe(() => {
      dialogRef.close();
    });
  }

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    const dayIndex = d.getDate() % 5;
    const colorIndex = dayIndex % this.colors.length;
    return this.colors[colorIndex] + '-date';
  };
}

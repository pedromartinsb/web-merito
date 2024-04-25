import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { DialogOverviewComponent } from 'src/app/components/dialog-overview/dialog-overview.component';
import { Activity, Appointment } from 'src/app/models/appointment';
import { Company } from 'src/app/models/company';
import { Person } from 'src/app/models/person';
import { monthlyTag, Tag } from 'src/app/models/tag';
import { AppointmentService } from 'src/app/services/appointment.service';
import { CompanyService } from 'src/app/services/company.service';
import { PersonService } from 'src/app/services/person.service';
import { TagService } from 'src/app/services/tag.service';

import { DescriptionModalComponent } from '../../../components/description/description-modal';
import { Responsibility } from 'src/app/models/responsibility';
import { ResponsibilityService } from 'src/app/services/responsibility.service';

interface DescriptionDialogData {
  activity: Activity;
  isDescriptionEditable: boolean;
}

export interface DialogData {
  description: string;
  justification: string;
  isDescriptionEditable: boolean;
}

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css'],
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
    routineId: '',
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  isSelected: boolean = false;
  companyId: string;
  responsibilityId: string = '';
  personId: string = '';

  companies: Company[] = [];
  responsibilities: Responsibility[] = [];
  persons: Person[] = [];
  tags: Tag[] = [];

  appointments: Appointment[] = [];
  activities: Activity[] = [];
  routines: Activity[] = [];

  startDate: Date = new Date();
  endDate: Date = new Date();
  allowAppointmentCreation: boolean = true;

  monthlyTags: monthlyTag[] = [];
  monthlyTagsKey: number = 0;
  calendarKeys: number[] = [];

  company: FormControl = new FormControl(null, [Validators.required]);
  reponsibility: FormControl = new FormControl(null, []);
  person: FormControl = new FormControl(null, [Validators.required]);

  floatLabelControl = new FormControl('auto' as FloatLabelType);

  selectedDateMonthly: Date | null;

  colors = ['blue', 'green', 'yellow', 'orange', 'red'];

  constructor(
    private companyService: CompanyService,
    private personService: PersonService,
    private responsibilityService: ResponsibilityService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private tagService: TagService,
    private appointmentService: AppointmentService,
    private cdr: ChangeDetectorRef
  ) {
    this.startDate = new Date();
    this.startDate.setUTCHours(0, 0, 0, 0);

    this.endDate = new Date();
    this.endDate.setUTCHours(23, 59, 59, 999);

    this.selectedDateMonthly = new Date();
  }

  ngOnInit(): void {
    this.findAllCompanies();
    this.findAllTags();
  }

  updateSelectedTag(activity: Activity, selectedTag: Tag): void {
    activity.tag = selectedTag;
    this.openDialog(activity);
  }

  openDialog(activity: Activity): void {
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '250px',
      height: '250px',
      data: {
        description: this.appointment.description,
        justification: this.appointment.justification,
      },
    });

    const isEditable = this.isCurrentDay(this.selectedDateMonthly);

    dialogRef.afterClosed().subscribe((result) => {
      this.appointment.description = result.description;
      this.appointment.justification = result.justification;

      this.appointment.activityId = activity.id;
      this.appointment.activityType = activity.type;
      this.appointment.tag = activity.tag;
      this.appointment.tagId = activity.tag.id;
      this.appointment.personId = this.personId;

      if (isEditable) {
        this.appointment.description = result.description;
        this.appointment.justification = result.justification;
        this.saveAppointment();
      } else {
        this.appointment.justification = result.justification;
        this.updateAppointment();
      }
    });
  }

  findAllCompanies(): void {
    this.companyService.findAll().subscribe((response) => {
      if (response.values != null) {
        this.toast.success('Empresas carregadas com sucesso');
        this.companies = response;
      }
    });
  }

  findAllReponsibilityByCompany(companyId: string): void {
    this.responsibilityService
      .findAllByCompany(companyId)
      .subscribe((response) => {
        if (response.values != null) {
          this.toast.success('Funções carregadas com sucesso');
          this.responsibilities = response;
        }
      });
  }

  findAllPersonByResponsibility(reponsibilityId: string) {
    this.personService
      .findAllByResponsibility(reponsibilityId)
      .subscribe((response) => {
        if (response.values != null) {
          this.toast.success('Funcionários carregados com sucesso');
          this.persons = response;
        }
      });
  }

  search(): void {
    if (this.person && this.person.value) {
      this.findActivities();
    } else {
      this.toast.warning('Selecione uma pessoa antes de pesquisar.');
    }
  }

  findAppointments(): void {
    this.appointmentService
      .findByPersonAndDate(this.person.value, this.startDate, this.endDate)
      .pipe(
        finalize(() => {
          this.categorizeActivities();
          this.toast.success('Pesquisa realizada com sucesso.');
          this.isSelected = true;
        })
      )
      .subscribe((response: Appointment[]) => {
        this.appointments = response;
        if (this.appointments && this.appointments.length > 0) {
          this.appointments.forEach((appointment) => {
            this.activities.forEach((activity) => {
              if (activity.id === appointment.routineId) {
                activity.description = appointment.description;
                activity.justification = appointment.justification;
              }
            });
          });
        }
      });
  }

  findActivities(): void {
    this.appointmentService
      .findActivitiesByPersonAndDate(
        this.person.value,
        this.startDate,
        this.endDate
      )
      .pipe(
        finalize(() => {
          this.findAppointments();
        })
      )
      .subscribe((response: Activity[]) => {
        this.activities = response;
      });
  }

  categorizeActivities() {
    this.routines = [];
    for (const activity of this.activities) {
      if (activity.type === 'routine') {
        this.routines.push(activity);
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
    this.appointmentService
      .update(this.appointment.id, this.appointment)
      .subscribe({
        next: () => {
          this.toast.success('Avaliação atualizada com sucesso', 'Atualização');
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  private saveAppointment() {
    if (this.appointment.id) {
      this.updateAppointment();
    } else {
      this.createAppointment();
    }
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

  fillTagDescription(): void {
    this.tags.forEach((tag) => {
      const tagName = tag.name;

      switch (tagName) {
        case 'Red':
          tag.description = 'Falha Grave';
          tag.class = 'red-appointment';
          break;
        case 'Orange':
          tag.description = 'Alerta (Erro cometido as vezes)';
          tag.class = 'orange-appointment';
          break;
        case 'Yellow':
          tag.description = 'Atenção (Corrigir de forma educativa)';
          tag.class = 'yellow-appointment';
          break;
        case 'Green':
          tag.description = 'Dever cumprido!';
          tag.class = 'green-appointment';
          break;
        case 'Blue':
          tag.description = ' Ótimo, Parábens, Excelente!';
          tag.class = 'blue-appointment';
          break;
      }
    });
  }

  openDescriptionDialog(data: DescriptionDialogData): void {
    const isEditable = this.isCurrentDay(this.selectedDateMonthly);

    const dialogRef = this.dialog.open(DescriptionModalComponent, {
      data: {
        description: data.activity.description || '',
        justification: data.activity.justification || '',
        isDescriptionEditable: data.isDescriptionEditable,
      },
    });

    this.appointment.activityId = data.activity.id;
    this.appointment.activityType = data.activity.type;
    this.appointment.tag = data.activity.tag;
    this.appointment.tagId = data.activity.tag.id;
    this.appointment.personId = this.personId;

    dialogRef.componentInstance.descriptionSave.subscribe(
      (result: { description: string; justification: string }) => {
        if (isEditable) {
          this.appointment.description = result.description;
          this.appointment.justification = result.justification;
          this.saveAppointment();
        } else {
          this.appointment.justification = result.justification;
          this.updateAppointment();
        }

        data.activity.description = result.description;
        data.activity.justification = result.justification;

        dialogRef.close();
      }
    );

    dialogRef.componentInstance.descriptionCancel.subscribe(() => {
      dialogRef.close();
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index === 2) {
      this.fetchTagsForRange(3);
    } else if (event.index === 3) {
      this.fetchTagsForRange(6);
    } else if (event.index === 1) {
      this.fetchMonthlyTags();
    }
  }

  isCurrentDay(date: Date): boolean {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(date.getTime());
      selectedDate.setHours(0, 0, 0, 0);
      return today.getTime() === selectedDate.getTime();
    }
    return true;
  }

  onDateChange(newDate: Date, offset: number): void {
    this.selectedDateMonthly = new Date(
      newDate.getFullYear(),
      newDate.getMonth() - offset,
      newDate.getDate()
    );

    this.startDate = new Date(this.selectedDateMonthly.setUTCHours(0, 0, 0, 0));
    this.endDate = new Date(
      this.selectedDateMonthly.setUTCHours(23, 59, 59, 999)
    );

    this.allowAppointmentCreation = this.isCurrentDay(this.selectedDateMonthly);

    if (this.person && this.person.value) {
      this.findActivities();
    }
  }

  getStartOfMonth(offset: number): Date {
    const date = new Date(
      this.selectedDateMonthly.getFullYear(),
      this.selectedDateMonthly.getMonth() + offset,
      1
    );
    return date;
  }

  fetchMonthlyTags(): void {
    if (!this.selectedDateMonthly) {
      this.selectedDateMonthly = new Date();
    }

    const startOfMonth = new Date(
      this.selectedDateMonthly.getFullYear(),
      this.selectedDateMonthly.getMonth(),
      1
    );
    let endOfMonth = new Date(
      this.selectedDateMonthly.getFullYear(),
      this.selectedDateMonthly.getMonth() + 1,
      0
    );
    endOfMonth = new Date(endOfMonth.setHours(23, 59, 59, 999));

    this.appointmentService
      .getMonthlyTags(this.personId, startOfMonth, endOfMonth)
      .subscribe((tags) => {
        this.monthlyTags = tags;
        this.monthlyTagsKey++;
        this.cdr.detectChanges();
      });
  }

  fetchTagsForRange(months: number): void {
    if (!this.selectedDateMonthly) {
      this.selectedDateMonthly = new Date();
    }

    const startOfMonth = new Date(
      this.selectedDateMonthly.getFullYear(),
      this.selectedDateMonthly.getMonth(),
      1
    );
    let endOfMonth = new Date(
      this.selectedDateMonthly.getFullYear(),
      this.selectedDateMonthly.getMonth() + months,
      0
    );
    endOfMonth = new Date(endOfMonth.setHours(23, 59, 59, 999));

    this.appointmentService
      .getMonthlyTags(this.personId, startOfMonth, endOfMonth)
      .subscribe((tags) => {
        this.monthlyTags = tags;
        this.calendarKeys = Array.from({ length: months }, (_, i) =>
          Math.random()
        );
        this.cdr.detectChanges();
      });
  }

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    if (!this.monthlyTags || this.monthlyTags.length === 0) {
      return '';
    }

    const localDateString = d.toISOString().split('T')[0];

    const foundTag = this.monthlyTags.find((tag) => {
      const tagDate = new Date(tag.date);

      const tagDateString = tagDate.toISOString().split('T')[0];

      return tagDateString === localDateString;
    });

    if (foundTag) {
      return `${foundTag.tag.toLowerCase()}-date`;
    }

    return '';
  };

  validateFields(): boolean {
    return this.company.valid && this.person.valid;
  }
}

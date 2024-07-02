import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { Activity, Appointment } from 'src/app/models/appointment';
import { Person } from 'src/app/models/person';
import { monthlyTag, Tag } from 'src/app/models/tag';
import { PersonService } from 'src/app/services/person.service';
import { TagService } from 'src/app/services/tag.service';

import { AppointmentService } from './../../../services/appointment.service';
import { PersonAppointmentConfirmComponent } from './person-appointment-confirm/person-appointment-confirm.component';
import { PersonAppointmentDialogComponent } from './person-appointment-dialog/person-appointment-dialog.component';

@Component({
  selector: 'app-person-appointment',
  templateUrl: './person-appointment.component.html',
  styleUrls: ['./person-appointment.component.css'],
})
export class PersonAppointmentComponent implements OnInit {
  displayedColumns = ['name', 'radio'];
  dataSource: Activity[];

  personId: string;
  monthlyTags: monthlyTag[] = [];
  days: number[] = [];
  weeks: number[] = [];
  selected: Date | null;
  selectedDateMonthly: Date | null;
  activitiesResponse: Activity[];
  activitiesDailyResponse: Activity[];
  appointments: Appointment[] = [];
  tags: Tag[];
  firstDay: Date;
  lastDay: Date;
  daysOfMonth: number[] = [];
  person: Person;
  today: string = new Date().toLocaleDateString('pt-BR');
  startDate = new Date();
  endDate = new Date();
  selectedTab = new FormControl(0);

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private tagService: TagService,
    private appointmentService: AppointmentService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    // Receive the person id and get Person
    this.receivePersonAndPersonId();

    // Create a Tag list
    this.createTagList();

    // Receive all the Activites with Appointments
    this.receiveAllActivities();

    // Receive the current Month Tags
    this.receiveCurrentMonthTags();

    // get the Date to Calendar
    this.getDateCalendar();
  }

  private receivePersonAndPersonId(): void {
    this.personId = this.route.snapshot.params['personId'];
    this.personService.findById(this.personId).subscribe((response) => {
      this.person = response;
    });
  }

  private createTagList(): void {
    this.tagService.findAll().subscribe((response) => {
      this.tags = response;
      this.fillTagDescription();
    });
  }

  private receiveAllActivities(): void {
    this.startDate.setUTCHours(0, 0, 0, 0);
    this.endDate.setUTCHours(23, 59, 59, 999);
    this.appointmentService
      .findActivitiesByPersonAndDate(
        this.personId,
        new Date(this.startDate),
        new Date(this.endDate)
      )
      .pipe(
        finalize(() => {
          this.findAppointments();
        })
      )
      .subscribe((response) => {
        this.toast.success('Pesquisa realizada com sucesso.');
        this.activitiesDailyResponse = response;
        this.dataSource = response;
        console.log(this.dataSource);
      });
  }

  private findAppointments(): void {
    this.appointmentService
      .findByPersonAndDate(this.personId, this.startDate, this.endDate)
      .subscribe((response: Appointment[]) => {
        this.appointments = response;
        if (this.appointments && this.appointments.length > 0) {
          this.appointments.forEach((appointment) => {
            this.activitiesResponse.forEach((activity) => {
              if (activity.id === appointment.routineId) {
                activity.description = appointment.description;
                activity.justification = appointment.justification;
              }
            });
          });
        }
      });
  }

  private receiveCurrentMonthTags(): void {
    this.monthlyTags = history.state.monthlyTags;
    this.monthlyTags.map((month) => {
      let newDate = new Date(month.date);
      newDate.setDate(newDate.getDate() + 1);
      this.daysOfMonth.push(newDate.getDate());
    });
  }

  private getDateCalendar(): void {
    var date = new Date();
    this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  private fillTagDescription(): void {
    this.tags.forEach((tag) => {
      const tagName = tag.name;

      switch (tagName) {
        case 'Red':
          tag.description = 'Falha Grave';
          tag.class = 'red-background';
          break;
        case 'Orange':
          tag.description = 'Alerta (Erro cometido as vezes)';
          tag.class = 'orange-background';
          break;
        case 'Yellow':
          tag.description = 'Atenção (Corrigir de forma educativa)';
          tag.class = 'yellow-background';
          break;
        case 'Green':
          tag.description = 'Dever cumprido!';
          tag.class = 'green-background';
          break;
        case 'Blue':
          tag.description = ' Ótimo, Parábens, Excelente!';
          tag.class = 'blue-background';
          break;
      }
    });
  }

  public dateClass: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfMonth.length; i++) {
      if (this.daysOfMonth[i] == cellDate.getDate()) {
        if (this.monthlyTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.monthlyTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.monthlyTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.monthlyTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.monthlyTags[i].tag == 'Yellow') {
          return 'yellow-background';
        } else {
          return 'green-background';
        }
      }
    }
  };

  public openDialog() {
    this.selectedDateMonthly = this.selected;

    this.appointmentService
      .findActivitiesByPersonAndDate(
        this.personId,
        new Date(this.selectedDateMonthly.setHours(0, 0, 0)),
        new Date(this.selectedDateMonthly.setHours(20, 59, 59))
      )
      .subscribe((response) => {
        this.activitiesResponse = response;
        this.toast.success('Pesquisa realizada com sucesso.');

        this.dialog.open(PersonAppointmentDialogComponent, {
          data: {
            activities: this.activitiesResponse,
            tags: this.tags,
            personId: this.personId,
            selected: this.selected,
          },
        });
      });
  }

  public openConfirm(tagId: string, activity: Activity) {
    this.dialog.open(PersonAppointmentConfirmComponent, {
      data: {
        tagId: tagId,
        activityId: activity.id,
        personId: this.personId,
        activityType: activity.type,
        activity: activity,
        selected: new Date(),
      },
      height: '400px',
      width: '600px',
    });
  }
}

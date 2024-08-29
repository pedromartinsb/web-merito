import { AfterViewInit, Component, OnDestroy } from '@angular/core';
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
export class PersonAppointmentComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'radio'];
  dataSource: Activity[];

  currentMontTags: monthlyTag[] = [];
  lastMonthTags: monthlyTag[] = [];
  lastTwoMonthTags: monthlyTag[] = [];
  lastThreeMonthTags: monthlyTag[] = [];
  lastFourMonthTags: monthlyTag[] = [];
  lastFiveMonthTags: monthlyTag[] = [];

  daysOfMonth: number[] = [];
  daysOfCurrentMonth: number[] = [];
  daysOfLastMonth: number[] = [];
  daysOfLastTwoMonth: number[] = [];
  daysOfLastThreeMonth: number[] = [];
  daysOfLastFourMonth: number[] = [];
  daysOfLastFiveMonth: number[] = [];

  personId: string;
  days: number[] = [];
  weeks: number[] = [];
  selected: Date | null;
  selectedDateMonthly: Date | null;
  selectedQuarterly1: Date | null;
  selectedQuarterly2: Date | null;
  selectedQuarterly3: Date | null;
  activitiesResponse: Activity[];
  activitiesDailyResponse: Activity[];
  appointments: Appointment[] = [];
  tags: Tag[];
  firstDay: Date;
  lastDay: Date;
  firstDayLastMonth: Date;
  lastDayLastMonth: Date;
  firstDayLastTwoMonth: Date;
  lastDayLastTwoMonth: Date;
  firstDayLastThreeMonth: Date;
  lastDayLastThreeMonth: Date;
  firstDayLastFourMonth: Date;
  lastDayLastFourMonth: Date;
  firstDayLastFiveMonth: Date;
  lastDayLastFiveMonth: Date;
  person: Person;
  today: string = new Date().toLocaleDateString('pt-BR');
  startDate = new Date();
  endDate = new Date();
  selectedTab = new FormControl(0);
  s3Url = 'https://sistema-merito.s3.amazonaws.com/';

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private tagService: TagService,
    private appointmentService: AppointmentService,
    private personService: PersonService
  ) {
    // Receive the person id and get Person
    this.receivePersonAndPersonId();

    // Create a Tag list
    this.createTagList();

    // Receive all the Activites with Appointments
    this.receiveAllActivities();

    // get the Date to Calendar
    this.getDateCalendar();

    // Receive the current Month Tags
    this.receiveCurrentMonthTags();
    // Receive the last Month Tags
    this.receiveLastMonthTags();
    // Receive the last two Month Tags
    this.receiveLastTwoMonthTags();
    // Receive the last three Month Tags
    this.receiveLastThreeMonthTags();
    // Receive the last four Month Tags
    this.receiveLastFourMonthTags();
    // Receive the last five Month Tags
    this.receiveLastFiveMonthTags();
  }

  ngOnDestroy(): void {
    localStorage.setItem('isLoadedBefore', 'false');
  }

  ngAfterViewInit(): void {
    if (
      localStorage.getItem('isLoadedBefore') === 'false' ||
      !localStorage.getItem('isLoadedBefore')
    ) {
      window.location.reload();
      localStorage.setItem('isLoadedBefore', 'true');
    }
  }

  private receivePersonAndPersonId(): void {
    this.personId = this.route.snapshot.params['personId'];
    this.personService.findById(this.personId).subscribe((response) => {
      response.picture = this.s3Url + response.picture;
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
          this.findAppointmentsByToday();
        })
      )
      .subscribe((response) => {
        this.toast.success('Pesquisa realizada com sucesso.');
        this.activitiesDailyResponse = response;
        this.dataSource = response;
      });
  }

  private findAppointmentsByToday(): void {
    this.appointmentService
      .findByPersonAndDate(this.personId, this.startDate, this.endDate)
      .subscribe((response: Appointment[]) => {
        if (response != null) {
          this.appointments = response;
          if (this.appointments && this.appointments.length > 0) {
            this.appointments.forEach((appointment) => {
              if (this.activitiesResponse != undefined) {
                this.activitiesResponse.forEach((activity) => {
                  if (activity.id === appointment.routineId) {
                    activity.description = appointment.description;
                    activity.justification = appointment.justification;
                  }
                });
              }
            });
          }
        }
      });
  }

  private receiveCurrentMonthTags(): void {
    this.currentMontTags = JSON.parse(localStorage.getItem('currentMonth'));
    if (this.currentMontTags != undefined) {
      this.currentMontTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfMonth.push(newDate.getDate());
      });
    }
  }

  private receiveLastMonthTags(): void {
    this.lastMonthTags = JSON.parse(localStorage.getItem('lastMonth'));
    if (this.lastMonthTags != undefined) {
      this.lastMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastMonth.push(newDate.getDate());
      });
    }
  }

  private receiveLastTwoMonthTags(): void {
    this.lastTwoMonthTags = JSON.parse(localStorage.getItem('lastTwoMonth'));
    if (this.lastTwoMonthTags != undefined) {
      this.lastTwoMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastTwoMonth.push(newDate.getDate());
      });
    }
  }

  private receiveLastThreeMonthTags(): void {
    this.lastThreeMonthTags = JSON.parse(
      localStorage.getItem('lastThreeMonth')
    );
    if (this.lastThreeMonthTags != undefined) {
      this.lastThreeMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastThreeMonth.push(newDate.getDate());
      });
    }
  }

  private receiveLastFourMonthTags(): void {
    this.lastFourMonthTags = JSON.parse(localStorage.getItem('lastFourMonth'));
    if (this.lastFourMonthTags != undefined) {
      this.lastFourMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastFourMonth.push(newDate.getDate());
      });
    }
  }

  private receiveLastFiveMonthTags(): void {
    this.lastFiveMonthTags = JSON.parse(localStorage.getItem('lastFiveMonth'));
    if (this.lastFiveMonthTags != undefined) {
      this.lastFiveMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastFiveMonth.push(newDate.getDate());
      });
    }
  }

  private getDateCalendar(): void {
    var date = new Date();
    this.firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.firstDayLastMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1
    );
    this.lastDayLastMonth = new Date(
      date.getFullYear(),
      this.firstDayLastMonth.getMonth() + 1,
      0
    );
    this.firstDayLastTwoMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 2,
      1
    );
    this.lastDayLastTwoMonth = new Date(
      date.getFullYear(),
      this.firstDayLastTwoMonth.getMonth() + 1,
      0
    );
    this.firstDayLastThreeMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 3,
      1
    );
    this.lastDayLastThreeMonth = new Date(
      date.getFullYear(),
      this.firstDayLastThreeMonth.getMonth() + 1,
      0
    );
    this.firstDayLastFourMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 4,
      1
    );
    this.lastDayLastFourMonth = new Date(
      date.getFullYear(),
      this.firstDayLastFourMonth.getMonth() + 1,
      0
    );
    this.firstDayLastFiveMonth = new Date(
      date.getFullYear(),
      date.getMonth() - 5,
      1
    );
    this.lastDayLastFiveMonth = new Date(
      date.getFullYear(),
      this.firstDayLastFiveMonth.getMonth() + 1,
      0
    );
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

  public dateClassCurrentMonth: MatCalendarCellClassFunction<Date> = (
    cellDate,
    _
  ) => {
    for (let i = 0; i < this.daysOfMonth.length; i++) {
      if (this.daysOfMonth[i] == cellDate.getDate()) {
        if (this.currentMontTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.currentMontTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.currentMontTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.currentMontTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.currentMontTags[i].tag == 'Yellow') {
          return 'yellow-background';
        } else {
          return 'green-background';
        }
      }
    }
  };

  public dateClassLastMonth: MatCalendarCellClassFunction<Date> = (
    cellDate,
    _
  ) => {
    for (let i = 0; i < this.daysOfLastMonth.length; i++) {
      if (this.daysOfLastMonth[i] == cellDate.getDate()) {
        if (this.lastMonthTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.lastMonthTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.lastMonthTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.lastMonthTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.lastMonthTags[i].tag == 'Yellow') {
          return 'yellow-background';
        } else {
          return 'green-background';
        }
      }
    }
  };

  public dateClassLastTwoMonth: MatCalendarCellClassFunction<Date> = (
    cellDate,
    _
  ) => {
    for (let i = 0; i < this.daysOfLastTwoMonth.length; i++) {
      if (this.daysOfLastTwoMonth[i] == cellDate.getDate()) {
        if (this.lastTwoMonthTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.lastTwoMonthTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.lastTwoMonthTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.lastTwoMonthTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.lastTwoMonthTags[i].tag == 'Yellow') {
          return 'yellow-background';
        } else {
          return 'green-background';
        }
      }
    }
  };

  public dateClassLastThreeMonth: MatCalendarCellClassFunction<Date> = (
    cellDate,
    _
  ) => {
    for (let i = 0; i < this.daysOfLastThreeMonth.length; i++) {
      if (this.daysOfLastThreeMonth[i] == cellDate.getDate()) {
        if (this.lastThreeMonthTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.lastThreeMonthTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.lastThreeMonthTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.lastThreeMonthTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.lastThreeMonthTags[i].tag == 'Yellow') {
          return 'yellow-background';
        } else {
          return 'green-background';
        }
      }
    }
  };

  public dateClassLastFourMonth: MatCalendarCellClassFunction<Date> = (
    cellDate,
    _
  ) => {
    for (let i = 0; i < this.daysOfLastFourMonth.length; i++) {
      if (this.daysOfLastFourMonth[i] == cellDate.getDate()) {
        if (this.lastFourMonthTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.lastFourMonthTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.lastFourMonthTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.lastFourMonthTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.lastFourMonthTags[i].tag == 'Yellow') {
          return 'yellow-background';
        } else {
          return 'green-background';
        }
      }
    }
  };

  public dateClassLastFiveMonth: MatCalendarCellClassFunction<Date> = (
    cellDate,
    _
  ) => {
    for (let i = 0; i < this.daysOfLastFiveMonth.length; i++) {
      if (this.daysOfLastFiveMonth[i] == cellDate.getDate()) {
        if (this.lastFiveMonthTags[i].tag == 'Green') {
          return 'green-background';
        } else if (this.lastFiveMonthTags[i].tag == 'Red') {
          return 'red-background';
        } else if (this.lastFiveMonthTags[i].tag == 'Blue') {
          return 'blue-background';
        } else if (this.lastFiveMonthTags[i].tag == 'Orange') {
          return 'orange-background';
        } else if (this.lastFiveMonthTags[i].tag == 'Yellow') {
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

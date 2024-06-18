import { Component, OnInit } from '@angular/core';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Activity } from 'src/app/models/appointment';
import { Person } from 'src/app/models/person';
import { monthlyTag, Tag } from 'src/app/models/tag';
import { PersonService } from 'src/app/services/person.service';
import { TagService } from 'src/app/services/tag.service';

import { AppointmentService } from './../../../services/appointment.service';
import { PersonAppointmentDialogComponent } from './person-appointment-dialog/person-appointment-dialog.component';
import { PersonAppointmentConfirmComponent } from './person-appointment-confirm/person-appointment-confirm.component';

@Component({
  selector: 'app-person-appointment',
  templateUrl: './person-appointment.component.html',
  styleUrls: ['./person-appointment.component.scss'],
})
export class PersonAppointmentComponent implements OnInit {
  personId: string;
  monthlyTags: monthlyTag[] = [];
  days: number[] = [];
  weeks: number[] = [];
  selected: Date | null;
  selectedDateMonthly: Date | null;
  activitiesResponse: Activity[];
  tags: Tag[];
  firstDay: Date;
  lastDay: Date;
  daysOfMonth: number[] = [];
  person: Person;
  today: string = new Date().toLocaleDateString('pt-BR');

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
    this.personId = this.route.snapshot.params['personId'];
    this.personService.findById(this.personId).subscribe((response) => {
      this.person = response;
    });

    // Create a Tag list
    this.tagService.findAll().subscribe((response) => {
      this.tags = response;
      this.fillTagDescription();
    });

    // Receive all the Appointments
    let startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    this.appointmentService
      .findActivitiesByPersonAndDate(
        this.personId,
        new Date(startDate),
        new Date(endDate)
      )
      .subscribe((response) => {
        this.activitiesResponse = response;
        console.log('response length: ' + response.length);
      });

    // Receive the current Month Tags
    this.monthlyTags = history.state.monthlyTags;
    this.monthlyTags.map((month) => {
      let newDate = new Date(month.date);
      newDate.setDate(newDate.getDate() + 1);
      this.daysOfMonth.push(newDate.getDate());
    });

    // get the Date to Calendar
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
          console.log('amarelo');
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
        console.log('response length: ' + response.length);

        this.toast.success('Pesquisa realizada com sucesso.');

        this.dialog.open(PersonAppointmentDialogComponent, {
          data: {
            activities: this.activitiesResponse,
            tags: this.tags,
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
      },
    });
  }
}

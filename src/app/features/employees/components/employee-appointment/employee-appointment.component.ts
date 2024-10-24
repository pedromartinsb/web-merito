import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs';
import {Activity, Appointment} from 'src/app/models/appointment';
import {Person} from 'src/app/models/person';
import {monthlyTag, Tag} from 'src/app/models/tag';
import {PersonService} from 'src/app/services/person.service';
import {TagService} from 'src/app/services/tag.service';
import {Urls} from "../../../../config/urls.config";
import {AppointmentService} from "../../../../services/appointment.service";
import {TaskService} from "../../../../services/task.service";
import {PersonAppointmentDialogComponent} from "../../../../pages/person/person-appointment/person-appointment-dialog/person-appointment-dialog.component";
import {PersonAppointmentConfirmComponent} from "../../../../pages/person/person-appointment/person-appointment-confirm/person-appointment-confirm.component";
import {Task} from "../../../../pages/person/person-appointment/person-appointment-task/person-appointment-task.component";
import {Modal} from "bootstrap";

@Component({
  selector: 'app-employee-appointment',
  templateUrl: './employee-appointment.component.html',
  styleUrls: ['./employee-appointment.component.css']
})
export class EmployeeAppointmentComponent implements AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'radio'];
  dataSource: Activity[];
  currentMontTags: monthlyTag[] = [];
  lastMonthTags: monthlyTag[] = [];
  lastTwoMonthTags: monthlyTag[] = [];
  lastThreeMonthTags: monthlyTag[] = [];
  lastFourMonthTags: monthlyTag[] = [];
  lastFiveMonthTags: monthlyTag[] = [];
  daysOfMonth: number[] = [];
  daysOfLastMonth: number[] = [];
  daysOfLastTwoMonth: number[] = [];
  daysOfLastThreeMonth: number[] = [];
  daysOfLastFourMonth: number[] = [];
  daysOfLastFiveMonth: number[] = [];
  s3DefaultImage = Urls.getDefaultPictureS3();
  personId: string;
  selected: Date | null;
  selectedDateMonthly: Date | null;
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
  tasks: Task[] = [];
  task: Task = {
    id: '',
    personId: '',
    title: '',
    description: '',
    startDate: '',
    endDate:''
  };
  options = [
    { index: '1', color: 'red'},
    { index: '2', color: 'orange'},
    { index: '3', color: 'yellow'},
    { index: '4', color: 'green'},
    { index: '5', color: ''},
  ];
  items = [
    { name: 'Item 1', value: '10' },
    { name: 'Item 2', value: '20' },
    { name: 'Item 3', value: '30' },
    { name: 'Item 4', value: '40' },
  ];
  formTask: FormGroup;
  formGoal: FormGroup;
  formAppointment: FormGroup;
  isSavingTask: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private toast: ToastrService,
              private tagService: TagService, private appointmentService: AppointmentService, private personService: PersonService,
              private taskService: TaskService) {
    this._initializeFormsGroup();
    this._initializePerson();
    this._initializeTags();
    this._initializeTasks();
    this._initializeGoals(); // TODO: ajustar o método
  }

  _initializeFormsGroup() {
    this.formTask = new FormGroup({
      id: new FormControl(''),
      title: new FormControl(''),
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
    this.formGoal = new FormGroup({
      description: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
    this.formAppointment = new FormGroup({
      id: new FormControl(''),
      personId: new FormControl(''),
      description: new FormControl(''),
      justification: new FormControl(''),
      activityType: new FormControl(''),
      tagId: new FormControl(''),
      activityId: new FormControl(''),
      createdAt: new FormControl(''),
    });
  }

  _initializePerson() {
    this._getPersonId();
    this._getPersonById();
  }

  _initializeTags() {
    this._setTagList();
    this._getActivities();
    this._getDateCalendar();
    this._getCurrentMonthTags();
    this._getLastMonthTags();
    this._getLastTwoMonthTags();
    this._getLastThreeMonthTags();
    this._getLastFourMonthTags();
    this._getLastFiveMonthTags();
  }

  _initializeTasks() {
    this.taskService.findAllByPersonId(this.personId).subscribe({
      next: (response) => {
        if (response != null) {
          this.tasks = response;
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  _initializeGoals() {
  }

  ngOnDestroy(): void {
    localStorage.setItem('isLoadedBefore', 'false');
    localStorage.removeItem('currentMonth');
    localStorage.removeItem('lastMonth');
    localStorage.removeItem('lastTwoMonth');
    localStorage.removeItem('lastThreeMonth');
    localStorage.removeItem('lastFourMonth');
    localStorage.removeItem('lastFiveMonth');
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

  _getPersonId(): void {
    this.personId = this.route.snapshot.params['id'];
  }

  _getPersonById(): void {
    this.personService.findById(this.personId).subscribe((response) => {
      response.picture = Urls.getS3() + response.picture;
      this.person = response;
    });
  }

  _setTagList() {
    this.tagService.findAll().subscribe((response) => {
      this.tags = response;
      this.fillTagDescription();
    });
  }

  _getActivities() {
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
          this._getAppointmentsByToday();
        })
      )
      .subscribe((response) => {
        this.toast.success('Pesquisa realizada com sucesso.');
        this.activitiesDailyResponse = response;
        this.dataSource = response;
      });
  }

  _getAppointmentsByToday() {
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

  _getCurrentMonthTags() {
    this.currentMontTags = JSON.parse(localStorage.getItem('currentMonth'));
    if (this.currentMontTags != undefined) {
      this.currentMontTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfMonth.push(newDate.getDate());
      });
    }
  }

  _getLastMonthTags(): void {
    this.lastMonthTags = JSON.parse(localStorage.getItem('lastMonth'));
    if (this.lastMonthTags != undefined) {
      this.lastMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastMonth.push(newDate.getDate());
      });
    }
  }

  _getLastTwoMonthTags(): void {
    this.lastTwoMonthTags = JSON.parse(localStorage.getItem('lastTwoMonth'));
    if (this.lastTwoMonthTags != undefined) {
      this.lastTwoMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastTwoMonth.push(newDate.getDate());
      });
    }
  }

  _getLastThreeMonthTags(): void {
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

  _getLastFourMonthTags(): void {
    this.lastFourMonthTags = JSON.parse(localStorage.getItem('lastFourMonth'));
    if (this.lastFourMonthTags != undefined) {
      this.lastFourMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastFourMonth.push(newDate.getDate());
      });
    }
  }

  _getLastFiveMonthTags(): void {
    this.lastFiveMonthTags = JSON.parse(localStorage.getItem('lastFiveMonth'));
    if (this.lastFiveMonthTags != undefined) {
      this.lastFiveMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastFiveMonth.push(newDate.getDate());
      });
    }
  }

  _getDateCalendar() {
    const date = new Date();
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
          height: 'fit-content',
          width: 'fit-content',
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
      height: 'fit-content',
      width: 'fit-content',
    });
  }

  openAppointmentModal() {
    this.selectedDateMonthly = this.selected;

    this.appointmentService
      .findActivitiesByPersonAndDate(
        this.personId,
        new Date(this.selectedDateMonthly.setHours(0, 0, 0)),
        new Date(this.selectedDateMonthly.setHours(20, 59, 59))
      )
      .subscribe((response) => {
        this.activitiesResponse = response;
        const modalElement = document.getElementById('appointmentsModal');
        if (modalElement) {
          const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
          modalInstance.show();
        }
        this.toast.success('Pesquisa realizada com sucesso.');
      });
  }

  openAppointmentCreateModal(activity: Activity, tag: Tag): void {
    this.formAppointment.reset();
    if (activity.appointmentId != undefined) {
      this.formAppointment.get('id').patchValue(activity.appointmentId);
    }
    this.formAppointment.get('personId').patchValue(this.personId);
    this.formAppointment.get('description').patchValue(activity.description);
    this.formAppointment.get('justification').patchValue(activity.justification);
    this.formAppointment.get('activityType').patchValue(activity.type);
    this.formAppointment.get('tagId').patchValue(tag.id);
    this.formAppointment.get('activityId').patchValue(activity.id);
    this.formAppointment.get('createdAt').patchValue(this.selected.toISOString());

    const modalElement = document.getElementById('appointmentsCreateModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeAppointmentCreateModal(): void {
    this.formTask.reset();
    const modalElement = document.getElementById('appointmentsCreateModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  onSubmitFormAppointment() {
    console.log(this.formAppointment.value);
    this.appointmentService.createByDate(this.formAppointment.value).subscribe({
      next: () => {
        this.toast.success('Avaliação criada com sucesso', 'Cadastro');
        window.location.reload();
      },
      error: (ex) => this._handleErrors(ex),
    });
  }

  openTasksModal(): void {
    const modalElement = document.getElementById('tasksModal');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeTaskCreateModal(): void {
    this.formTask.reset();
    const modalElement = document.getElementById('tasksCreateModal2');
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  onSubmitFormTask() {
    this.isSavingTask = true;
    this.task = this.formTask.value;
    this.task.personId = this.personId;

    if (this.task.id) {
      this.taskService.update(this.task.id, this.task).subscribe({
        next: () => {
          this.toast.success('Tarefa alterada com sucesso', 'Cadastro');
          setTimeout(() => {
            this.isSavingTask = false;
            window.location.reload();
          }, 2000);
        },
        error: (ex) => {
          this.isSavingTask = false;
          this._handleErrors(ex);
        }
      });
    } else {
      this.taskService.create(this.task).subscribe({
        next: () => {
          this.toast.success('Tarefa cadastrada com sucesso', 'Cadastro');
          setTimeout(() => {
            this.isSavingTask = false;
            window.location.reload();
          }, 2000);
        },
        error: (ex) => {
          this.isSavingTask = false;
          this._handleErrors(ex);
        }
      });
    }
  }

  onEditTask(task: Task) {
    this.formTask.patchValue(task);
    const modalElement = document.getElementById('tasksCreateModal2');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onDeleteTask(id: string) {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.toast.success('Tarefa deletada com sucesso', 'Exclusão');
        setTimeout(() => {
          this.isSavingTask = false;
          window.location.reload();
        }, 1500);
      },
      error: (ex) => {
        this.isSavingTask = false;
        this._handleErrors(ex);
      }
    });
  }

  onSubmitFormGoal() {

  }

  _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}

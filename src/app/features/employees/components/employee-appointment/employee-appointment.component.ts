import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatCalendarCellClassFunction } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, finalize, switchMap, tap } from "rxjs";
import { Activity, Appointment } from "src/app/models/appointment";
import { Person } from "src/app/models/person";
import { monthlyTag, Tag } from "src/app/models/tag";
import { PersonService } from "src/app/services/person.service";
import { TagService } from "src/app/services/tag.service";
import { Urls } from "../../../../config/urls.config";
import { AppointmentService } from "../../../../services/appointment.service";
import { TaskService } from "../../../../services/task.service";
import { PersonAppointmentDialogComponent } from "../../../../pages/person/person-appointment/person-appointment-dialog/person-appointment-dialog.component";
import { PersonAppointmentConfirmComponent } from "../../../../pages/person/person-appointment/person-appointment-confirm/person-appointment-confirm.component";
import { Task } from "../../../../pages/person/person-appointment/person-appointment-task/person-appointment-task.component";
import { Modal } from "bootstrap";
import { DatePipe, Location } from "@angular/common";
import { GoalService } from "src/app/services/goal.service";
import Swal from "sweetalert2";

export interface Goal {
  id?: string;
  personId?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: "app-employee-appointment",
  templateUrl: "./employee-appointment.component.html",
  styleUrls: ["./employee-appointment.component.css"],
})
export class EmployeeAppointmentComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ["name", "radio"];
  dataSource: Activity[];
  currentMonthTags: monthlyTag[] = [];
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
  activitiesResponse: Activity[] = [];
  activitiesDailyResponse: Activity[];
  appointments: Appointment[] = [];
  tags: Tag[] = [];

  imageUrl: string | ArrayBuffer | null = null;
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
  today: string = new Date().toLocaleDateString("pt-BR");
  startDate = new Date();
  endDate = new Date();
  selectedTab = new FormControl(0);

  abstinenceDocumentUrl: string | ArrayBuffer | null = null;
  vacationDocumentUrl: string | ArrayBuffer | null = null;
  selectedAbstinenceFile: File | null = null;
  selectedVacationFile: File | null = null;

  tasks: Task[] = [];
  task: Task = {
    id: "",
    personId: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  };

  goals: Goal[] = [];
  goal: Goal = {
    id: "",
    personId: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  };

  abstinences: any[] = [];
  vacations: any[] = [];
  vacation: any = {
    id: "",
    personId: "",
    description: "",
    startDate: "",
    endDate: "",
  };

  options = [
    { index: "1", color: "red", description: "Falha Grave" },
    { index: "2", color: "orange", description: "Alerta (Erro cometido as vezes)" },
    { index: "3", color: "yellow", description: "Atenção (Corrigir de forma educativa)" },
    { index: "4", color: "green", description: "Dever cumprido!" },
    { index: "5", color: "blue", description: "Acima da média" },
    { index: "6", color: "purple", description: "Ótimo, Parábens, Excelente!" },
  ];

  formTask: FormGroup;
  formGoal: FormGroup;
  formAppointment: FormGroup;
  formAbstinence: FormGroup;
  formVacation: FormGroup;

  isSavingAppointment: boolean = false;
  isSavingTask: boolean = false;
  isSavingGoal: boolean = false;
  isSavingAbstinence: boolean = false;
  isSavingVacation: boolean = false;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private tagService: TagService,
    private appointmentService: AppointmentService,
    private personService: PersonService,
    public router: Router,
    private taskService: TaskService,
    private location: Location,
    private datePipe: DatePipe,
    private goalService: GoalService
  ) {
    this._initializeFormsGroup();
    this._initializePerson();
    // this._initializeTags();
    this._initializeTasks();
    this._initializeGoals();
    this._initializeAbstinenceList();
    this._initializeVacationList();
  }
  ngOnInit(): void {
    this._initializeTags();
  }

  _initializeFormsGroup() {
    this.formTask = new FormGroup({
      id: new FormControl(""),
      title: new FormControl(""),
      description: new FormControl(""),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
    });
    this.formGoal = new FormGroup({
      id: new FormControl(""),
      title: new FormControl(""),
      description: new FormControl(""),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
    });
    this.formAppointment = new FormGroup({
      id: new FormControl(""),
      personId: new FormControl(""),
      description: new FormControl(""),
      justification: new FormControl(""),
      activityType: new FormControl(""),
      tagId: new FormControl(""),
      activityId: new FormControl(""),
      createdAt: new FormControl(""),
    });
    this.formAbstinence = new FormGroup({
      id: new FormControl(""),
      personId: new FormControl(""),
      description: new FormControl(""),
      document: new FormControl(null, Validators.required),
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
    });
    this.formVacation = new FormGroup({
      id: new FormControl(""),
      personId: new FormControl(""),
      description: new FormControl(""),
      document: new FormControl(null, Validators.required),
      startDate: new FormControl("", Validators.required),
      endDate: new FormControl("", Validators.required),
    });
  }

  private _initializePerson() {
    this.personId = this.route.snapshot.params["id"];
    this._getPersonById();
  }

  private _initializeTags() {
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

  private _initializeTasks() {
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

  private _initializeGoals() {
    this.goalService.findAllByPerson(this.personId).subscribe({
      next: (response) => {
        if (response != null) {
          this.goals = response;
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  private _initializeAbstinenceList() {
    this.appointmentService.findAbstinencesByPerson(this.personId).subscribe({
      next: (response) => {
        if (response != null) {
          console.log(response);
          this.abstinences = response;
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  private _initializeVacationList() {
    this.appointmentService.findVacationsByPerson(this.personId).subscribe({
      next: (response) => {
        if (response != null) {
          this.vacations = response;
        }
      },
      error: (ex) => {
        this._handleErrors(ex);
      },
    });
  }

  ngOnDestroy(): void {
    localStorage.setItem("isLoadedBefore", "false");
    localStorage.removeItem("currentMonth");
    localStorage.removeItem("lastMonth");
    localStorage.removeItem("lastTwoMonth");
    localStorage.removeItem("lastThreeMonth");
    localStorage.removeItem("lastFourMonth");
    localStorage.removeItem("lastFiveMonth");
  }

  ngAfterViewInit(): void {
    if (localStorage.getItem("isLoadedBefore") === "false" || !localStorage.getItem("isLoadedBefore")) {
      window.location.reload();
      localStorage.setItem("isLoadedBefore", "true");
    }
  }

  // _getPersonId(): void {
  //   this.personId = this.route.snapshot.params['id'];
  // }

  _getPersonById(): void {
    this.personService.findById(this.personId).subscribe((response) => {
      this.person = response;
    });
  }

  _setTagList() {
    this.tagService.findAll().subscribe((response) => {
      for (const tag of response) {
        if (tag.name != "Gray") {
          this.tags.push(tag);
        }
      }
      this.fillTagDescription();
    });
  }

  _getActivities() {
    this.startDate.setUTCHours(0, 0, 0, 0);
    this.endDate.setUTCHours(23, 59, 59, 999);
    this.appointmentService
      .findActivitiesByPersonAndDate(this.personId, new Date(this.startDate), new Date(this.endDate))
      .pipe(
        finalize(() => {
          this._getAppointmentsByToday();
        })
      )
      .subscribe((response) => {
        this.toast.success("Pesquisa realizada com sucesso.");
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
    this.currentMonthTags = JSON.parse(localStorage.getItem("currentMonth"));
    if (this.currentMonthTags != undefined) {
      const [todayDaySplit, monthSplit, yearSplit] = this.today.split("/");

      this.currentMonthTags.map((month) => {
        const [monthDateSplit, yearDateSplit, dayDateSplit] = month.date.split("-");
        if (dayDateSplit == todayDaySplit) {
          month.tag = "Green-Light";
        }

        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfMonth.push(newDate.getDate());
      });
    }
  }

  _getLastMonthTags(): void {
    this.lastMonthTags = JSON.parse(localStorage.getItem("lastMonth"));
    if (this.lastMonthTags != undefined) {
      this.lastMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastMonth.push(newDate.getDate());
      });
    }
  }

  _getLastTwoMonthTags(): void {
    this.lastTwoMonthTags = JSON.parse(localStorage.getItem("lastTwoMonth"));
    if (this.lastTwoMonthTags != undefined) {
      this.lastTwoMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastTwoMonth.push(newDate.getDate());
      });
    }
  }

  _getLastThreeMonthTags(): void {
    this.lastThreeMonthTags = JSON.parse(localStorage.getItem("lastThreeMonth"));
    if (this.lastThreeMonthTags != undefined) {
      this.lastThreeMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastThreeMonth.push(newDate.getDate());
      });
    }
  }

  _getLastFourMonthTags(): void {
    this.lastFourMonthTags = JSON.parse(localStorage.getItem("lastFourMonth"));
    if (this.lastFourMonthTags != undefined) {
      this.lastFourMonthTags.map((month) => {
        let newDate = new Date(month.date);
        newDate.setDate(newDate.getDate() + 1);
        this.daysOfLastFourMonth.push(newDate.getDate());
      });
    }
  }

  _getLastFiveMonthTags(): void {
    this.lastFiveMonthTags = JSON.parse(localStorage.getItem("lastFiveMonth"));
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
    this.firstDayLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.lastDayLastMonth = new Date(date.getFullYear(), this.firstDayLastMonth.getMonth() + 1, 0);
    this.firstDayLastTwoMonth = new Date(date.getFullYear(), date.getMonth() - 2, 1);
    this.lastDayLastTwoMonth = new Date(date.getFullYear(), this.firstDayLastTwoMonth.getMonth() + 1, 0);
    this.firstDayLastThreeMonth = new Date(date.getFullYear(), date.getMonth() - 3, 1);
    this.lastDayLastThreeMonth = new Date(date.getFullYear(), this.firstDayLastThreeMonth.getMonth() + 1, 0);
    this.firstDayLastFourMonth = new Date(date.getFullYear(), date.getMonth() - 4, 1);
    this.lastDayLastFourMonth = new Date(date.getFullYear(), this.firstDayLastFourMonth.getMonth() + 1, 0);
    this.firstDayLastFiveMonth = new Date(date.getFullYear(), date.getMonth() - 5, 1);
    this.lastDayLastFiveMonth = new Date(date.getFullYear(), this.firstDayLastFiveMonth.getMonth() + 1, 0);
  }

  private fillTagDescription(): void {
    this.tags.forEach((tag) => {
      const tagName = tag.name;

      switch (tagName) {
        case "Red":
          tag.description = "Falha Grave";
          tag.class = "red-background";
          break;
        case "Orange":
          tag.description = "Alerta (Erro cometido as vezes)";
          tag.class = "orange-background";
          break;
        case "Yellow":
          tag.description = "Atenção (Corrigir de forma educativa)";
          tag.class = "yellow-background";
          break;
        case "Green":
          tag.description = "Dever cumprido!";
          tag.class = "green-background";
          break;
        case "Blue":
          tag.description = "Acima da média";
          tag.class = "blue-background";
          break;
        case "Purple":
          tag.description = "Ótimo, Parábens, Excelente!";
          tag.class = "purple-background";
          break;
      }
    });
  }

  public dateClassCurrentMonth: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfMonth.length; i++) {
      if (this.daysOfMonth[i] == cellDate.getDate()) {
        if (this.currentMonthTags[i].tag == "Green") {
          return "green-background";
        } else if (this.currentMonthTags[i].tag == "Red") {
          return "red-background";
        } else if (this.currentMonthTags[i].tag == "Blue") {
          return "blue-background";
        } else if (this.currentMonthTags[i].tag == "Orange") {
          return "orange-background";
        } else if (this.currentMonthTags[i].tag == "Yellow") {
          return "yellow-background";
        } else if (this.currentMonthTags[i].tag == "Purple") {
          return "purple-background";
        } else if (this.currentMonthTags[i].tag == "Gray") {
          return "gray-background";
        } else if (this.currentMonthTags[i].tag == "Green-Light") {
          return "green-light-background";
        } else {
          return "green-background";
        }
      }
    }
  };

  public dateClassLastMonth: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfLastMonth.length; i++) {
      if (this.daysOfLastMonth[i] == cellDate.getDate()) {
        if (this.lastMonthTags[i].tag == "Green") {
          return "green-background";
        } else if (this.lastMonthTags[i].tag == "Red") {
          return "red-background";
        } else if (this.lastMonthTags[i].tag == "Blue") {
          return "blue-background";
        } else if (this.lastMonthTags[i].tag == "Orange") {
          return "orange-background";
        } else if (this.lastMonthTags[i].tag == "Yellow") {
          return "yellow-background";
        } else if (this.lastMonthTags[i].tag == "Purple") {
          return "purple-background";
        } else if (this.lastMonthTags[i].tag == "Gray") {
          return "gray-background";
        } else if (this.lastMonthTags[i].tag == "Green-Light") {
          return "green-light-background";
        } else {
          return "green-background";
        }
      }
    }
    // for (let i = 0; i < this.daysOfLastMonth.length; i++) {
    //   if (this.daysOfLastMonth[i] == cellDate.getDate()) {
    //     if (this.lastMonthTags[i].tag == 'Green') {
    //       return 'green-background';
    //     } else if (this.lastMonthTags[i].tag == 'Red') {
    //       return 'red-background';
    //     } else if (this.lastMonthTags[i].tag == 'Blue') {
    //       return 'blue-background';
    //     } else if (this.lastMonthTags[i].tag == 'Orange') {
    //       return 'orange-background';
    //     } else if (this.lastMonthTags[i].tag == 'Yellow') {
    //       return 'yellow-background';
    //     } else {
    //       return 'green-background';
    //     }
    //   }
    // }
  };

  public dateClassLastTwoMonth: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfLastTwoMonth.length; i++) {
      if (this.daysOfLastTwoMonth[i] == cellDate.getDate()) {
        if (this.lastTwoMonthTags[i].tag == "Green") {
          return "green-background";
        } else if (this.lastTwoMonthTags[i].tag == "Red") {
          return "red-background";
        } else if (this.lastTwoMonthTags[i].tag == "Blue") {
          return "blue-background";
        } else if (this.lastTwoMonthTags[i].tag == "Orange") {
          return "orange-background";
        } else if (this.lastTwoMonthTags[i].tag == "Yellow") {
          return "yellow-background";
        } else if (this.lastTwoMonthTags[i].tag == "Purple") {
          return "purple-background";
        } else if (this.lastTwoMonthTags[i].tag == "Gray") {
          return "gray-background";
        } else if (this.lastTwoMonthTags[i].tag == "Green-Light") {
          return "green-light-background";
        } else {
          return "green-background";
        }
      }
    }
    // for (let i = 0; i < this.daysOfLastTwoMonth.length; i++) {
    //   if (this.daysOfLastTwoMonth[i] == cellDate.getDate()) {
    //     if (this.lastTwoMonthTags[i].tag == 'Green') {
    //       return 'green-background';
    //     } else if (this.lastTwoMonthTags[i].tag == 'Red') {
    //       return 'red-background';
    //     } else if (this.lastTwoMonthTags[i].tag == 'Blue') {
    //       return 'blue-background';
    //     } else if (this.lastTwoMonthTags[i].tag == 'Orange') {
    //       return 'orange-background';
    //     } else if (this.lastTwoMonthTags[i].tag == 'Yellow') {
    //       return 'yellow-background';
    //     } else {
    //       return 'green-background';
    //     }
    //   }
    // }
  };

  public dateClassLastThreeMonth: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfLastThreeMonth.length; i++) {
      if (this.daysOfLastThreeMonth[i] == cellDate.getDate()) {
        if (this.lastThreeMonthTags[i].tag == "Green") {
          return "green-background";
        } else if (this.lastThreeMonthTags[i].tag == "Red") {
          return "red-background";
        } else if (this.lastThreeMonthTags[i].tag == "Blue") {
          return "blue-background";
        } else if (this.lastThreeMonthTags[i].tag == "Orange") {
          return "orange-background";
        } else if (this.lastThreeMonthTags[i].tag == "Yellow") {
          return "yellow-background";
        } else if (this.lastThreeMonthTags[i].tag == "Purple") {
          return "purple-background";
        } else if (this.lastThreeMonthTags[i].tag == "Gray") {
          return "gray-background";
        } else if (this.lastThreeMonthTags[i].tag == "Green-Light") {
          return "green-light-background";
        } else {
          return "green-background";
        }
      }
    }
    // for (let i = 0; i < this.daysOfLastThreeMonth.length; i++) {
    //   if (this.daysOfLastThreeMonth[i] == cellDate.getDate()) {
    //     if (this.lastThreeMonthTags[i].tag == 'Green') {
    //       return 'green-background';
    //     } else if (this.lastThreeMonthTags[i].tag == 'Red') {
    //       return 'red-background';
    //     } else if (this.lastThreeMonthTags[i].tag == 'Blue') {
    //       return 'blue-background';
    //     } else if (this.lastThreeMonthTags[i].tag == 'Orange') {
    //       return 'orange-background';
    //     } else if (this.lastThreeMonthTags[i].tag == 'Yellow') {
    //       return 'yellow-background';
    //     } else {
    //       return 'green-background';
    //     }
    //   }
    // }
  };

  public dateClassLastFourMonth: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfLastFourMonth.length; i++) {
      if (this.daysOfLastFourMonth[i] == cellDate.getDate()) {
        if (this.lastFourMonthTags[i].tag == "Green") {
          return "green-background";
        } else if (this.lastFourMonthTags[i].tag == "Red") {
          return "red-background";
        } else if (this.lastFourMonthTags[i].tag == "Blue") {
          return "blue-background";
        } else if (this.lastFourMonthTags[i].tag == "Orange") {
          return "orange-background";
        } else if (this.lastFourMonthTags[i].tag == "Yellow") {
          return "yellow-background";
        } else if (this.lastFourMonthTags[i].tag == "Purple") {
          return "purple-background";
        } else if (this.lastFourMonthTags[i].tag == "Gray") {
          return "gray-background";
        } else if (this.lastFourMonthTags[i].tag == "Green-Light") {
          return "green-light-background";
        } else {
          return "green-background";
        }
      }
    }
    // for (let i = 0; i < this.daysOfLastFourMonth.length; i++) {
    //   if (this.daysOfLastFourMonth[i] == cellDate.getDate()) {
    //     if (this.lastFourMonthTags[i].tag == 'Green') {
    //       return 'green-background';
    //     } else if (this.lastFourMonthTags[i].tag == 'Red') {
    //       return 'red-background';
    //     } else if (this.lastFourMonthTags[i].tag == 'Blue') {
    //       return 'blue-background';
    //     } else if (this.lastFourMonthTags[i].tag == 'Orange') {
    //       return 'orange-background';
    //     } else if (this.lastFourMonthTags[i].tag == 'Yellow') {
    //       return 'yellow-background';
    //     } else {
    //       return 'green-background';
    //     }
    //   }
    // }
  };

  public dateClassLastFiveMonth: MatCalendarCellClassFunction<Date> = (cellDate, _) => {
    for (let i = 0; i < this.daysOfLastFiveMonth.length; i++) {
      if (this.daysOfLastFiveMonth[i] == cellDate.getDate()) {
        if (this.lastFiveMonthTags[i].tag == "Green") {
          return "green-background";
        } else if (this.lastFiveMonthTags[i].tag == "Red") {
          return "red-background";
        } else if (this.lastFiveMonthTags[i].tag == "Blue") {
          return "blue-background";
        } else if (this.lastFiveMonthTags[i].tag == "Orange") {
          return "orange-background";
        } else if (this.lastFiveMonthTags[i].tag == "Yellow") {
          return "yellow-background";
        } else if (this.lastFiveMonthTags[i].tag == "Purple") {
          return "purple-background";
        } else if (this.lastFiveMonthTags[i].tag == "Gray") {
          return "gray-background";
        } else if (this.lastFiveMonthTags[i].tag == "Green-Light") {
          return "green-light-background";
        } else {
          return "green-background";
        }
      }
    }
    // for (let i = 0; i < this.daysOfLastFiveMonth.length; i++) {
    //   if (this.daysOfLastFiveMonth[i] == cellDate.getDate()) {
    //     if (this.lastFiveMonthTags[i].tag == 'Green') {
    //       return 'green-background';
    //     } else if (this.lastFiveMonthTags[i].tag == 'Red') {
    //       return 'red-background';
    //     } else if (this.lastFiveMonthTags[i].tag == 'Blue') {
    //       return 'blue-background';
    //     } else if (this.lastFiveMonthTags[i].tag == 'Orange') {
    //       return 'orange-background';
    //     } else if (this.lastFiveMonthTags[i].tag == 'Yellow') {
    //       return 'yellow-background';
    //     } else {
    //       return 'green-background';
    //     }
    //   }
    // }
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
        this.toast.success("Pesquisa realizada com sucesso.");

        this.dialog.open(PersonAppointmentDialogComponent, {
          data: {
            activities: this.activitiesResponse,
            tags: this.tags,
            personId: this.personId,
            selected: this.selected,
          },
          height: "fit-content",
          width: "fit-content",
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
      height: "fit-content",
      width: "fit-content",
    });
  }

  openAppointmentModal() {
    if (this.selected > new Date()) {
      this.toast.error("Não se pode salvar avaliação para data futura.");
      return;
    }

    this.selectedDateMonthly = this.selected;

    this.appointmentService
      .findActivitiesByPersonAndDate(
        this.personId,
        new Date(this.selectedDateMonthly.setHours(0, 0, 0)),
        new Date(this.selectedDateMonthly.setHours(20, 59, 59))
      )
      .subscribe((response) => {
        this.activitiesResponse = response;
        const modalElement = document.getElementById("appointmentsModal");
        if (modalElement) {
          const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
          modalInstance.show();
        }
        this.toast.success("Pesquisa realizada com sucesso.");
      });
  }

  openAppointmentCreateModal(activity: Activity, tag: Tag): void {
    this.formAppointment.reset();
    if (activity.appointmentId != undefined) {
      this.formAppointment.get("id").patchValue(activity.appointmentId);
    }
    this.formAppointment.get("personId").patchValue(this.personId);
    this.formAppointment.get("description").patchValue(activity.description);
    this.formAppointment.get("justification").patchValue(activity.justification);
    this.formAppointment.get("activityType").patchValue(activity.type);
    this.formAppointment.get("tagId").patchValue(tag.id);
    this.formAppointment.get("activityId").patchValue(activity.id);

    console.log("this.selected", this.selected);
    if (this.selected == undefined) {
      this.selected = new Date();
    }
    this.formAppointment.get("createdAt").patchValue(this.selected.toISOString());

    const modalElement = document.getElementById("appointmentsCreateModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
      this.closeAppointmentsModal();
    }
  }

  closeAppointmentsModal(): void {
    this.formTask.reset();
    const modalElement = document.getElementById("appointmentsModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  closeAppointmentCreateModal(): void {
    this.formTask.reset();
    const modalElement = document.getElementById("appointmentsCreateModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  onSubmitFormAppointment() {
    this.isSavingAppointment = true;

    if (this.formAppointment.get("id").value != null) {
      // update
      this.appointmentService.update(this.formAppointment.get("id").value, this.formAppointment.value).subscribe({
        next: () => {
          this.toast.success("Avaliação alterada com sucesso", "Alteração");
          this.closeAppointmentCreateModal();
          this.closeAppointmentsModal();
          this.location.back();
          this.isSavingAppointment = false;
        },
        error: (ex) => {
          this.isSavingAppointment = false;
          this._handleErrors(ex);
        },
      });
      return;
    }

    // create
    this.appointmentService.createByDate(this.formAppointment.value).subscribe({
      next: () => {
        this.toast.success("Avaliação criada com sucesso", "Cadastro");
        this.closeAppointmentCreateModal();
        this.closeAppointmentsModal();
        this.location.back();
        this.isSavingAppointment = false;
      },
      error: (ex) => {
        this.isSavingAppointment = false;
        this._handleErrors(ex);
      },
    });
  }

  openTasksModal(): void {
    const modalElement = document.getElementById("tasksModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  openTaskCreateModal(): void {
    this.formTask.reset();
    const modalElement = document.getElementById("tasksCreateModal2");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeTaskCreateModal(): void {
    this.formTask.reset();
    const modalElement = document.getElementById("tasksCreateModal2");
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
      // update
      this.taskService.update(this.task.id, this.task).subscribe({
        next: () => {
          this.toast.success("Tarefa alterada com sucesso", "Cadastro");
          setTimeout(() => {
            this.isSavingTask = false;
            window.location.reload();
          }, 2000);
        },
        error: (ex) => {
          this.isSavingTask = false;
          this._handleErrors(ex);
        },
      });
      return;
    }

    // create
    this.taskService.create(this.task).subscribe({
      next: () => {
        this.toast.success("Tarefa cadastrada com sucesso", "Cadastro");
        setTimeout(() => {
          this.isSavingTask = false;
          window.location.reload();
        }, 2000);
      },
      error: (ex) => {
        this.isSavingTask = false;
        this._handleErrors(ex);
      },
    });
  }

  onEditTask(task: Task) {
    const modalTasksElement = document.getElementById("tasksModal");
    if (modalTasksElement) {
      const modalInstance = Modal.getInstance(modalTasksElement) || new Modal(modalTasksElement);
      modalInstance.hide();
    }
    this.formTask.patchValue(task);
    const modalElement = document.getElementById("tasksCreateModal2");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onDeleteTask(id: string) {
    this.isSavingTask = true;
    this.taskService.delete(id).subscribe({
      next: () => {
        this.toast.success("Tarefa deletada com sucesso", "Exclusão");
        setTimeout(() => {
          this.isSavingTask = false;
          window.location.reload();
        }, 1500);
      },
      error: (ex) => {
        this.isSavingTask = false;
        this._handleErrors(ex);
      },
    });
  }

  onEditGoal(goal: Goal) {
    const modalGoalsElement = document.getElementById("goalsModal");
    if (modalGoalsElement) {
      const modalInstance = Modal.getInstance(modalGoalsElement) || new Modal(modalGoalsElement);
      modalInstance.hide();
    }
    this.formGoal.patchValue(goal);
    const modalElement = document.getElementById("goalsCreateModal2");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onDeleteGoal(id: string) {
    this.isSavingGoal = true;
    this.goalService.delete(id).subscribe({
      next: () => {
        this.toast.success("Meta deletada com sucesso", "Exclusão");
        setTimeout(() => {
          this.isSavingGoal = false;
          window.location.reload();
        }, 1500);
      },
      error: (ex) => {
        this.isSavingGoal = false;
        this._handleErrors(ex);
      },
    });
  }

  onEditAbstinence(abstinence: any) {
    const modalAbstinencesElement = document.getElementById("abstinencesModal");
    if (modalAbstinencesElement) {
      const modalInstance = Modal.getInstance(modalAbstinencesElement) || new Modal(modalAbstinencesElement);
      modalInstance.hide();
    }
    this.formAbstinence.patchValue(abstinence);
    const modalElement = document.getElementById("abstinencesCreateModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onDeleteAbstinence(id: string) {
    this.isSavingAbstinence = true;
    this.taskService.delete(id).subscribe({
      next: () => {
        this.toast.success("Atestado Médico deletado com sucesso", "Exclusão");
        setTimeout(() => {
          this.isSavingAbstinence = false;
          window.location.reload();
        }, 1500);
      },
      error: (ex) => {
        this.isSavingAbstinence = false;
        this._handleErrors(ex);
      },
    });
  }

  onEditVacation(vacation: any) {
    const modalVacationsElement = document.getElementById("vacationsModal");
    if (modalVacationsElement) {
      const modalInstance = Modal.getInstance(modalVacationsElement) || new Modal(modalVacationsElement);
      modalInstance.hide();
    }
    this.formVacation.patchValue(vacation);
    const modalElement = document.getElementById("vacationsCreateModal");
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  onDeleteVacation(id: string) {
    this.isSavingVacation = true;
    this.taskService.delete(id).subscribe({
      next: () => {
        this.toast.success("Férias deletada com sucesso", "Exclusão");
        setTimeout(() => {
          this.isSavingVacation = false;
          window.location.reload();
        }, 1500);
      },
      error: (ex) => {
        this.isSavingVacation = false;
        this._handleErrors(ex);
      },
    });
  }

  openGoalsModal(): void {
    const modalElement = document.getElementById("goalsModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  openGoalCreateModal(): void {
    this.formGoal.reset();
    const modalElement = document.getElementById("goalsCreateModal2");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeGoalCreateModal(): void {
    this.formGoal.reset();
    const modalElement = document.getElementById("goalsCreateModal2");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  onSubmitFormGoal() {
    this.isSavingGoal = true;
    this.goal = this.formGoal.value;
    this.goal.personId = this.personId;

    if (this.goal.id) {
      // update
      this.goalService.update(this.goal.id, this.goal).subscribe({
        next: () => {
          this.toast.success("Meta alterada com sucesso", "Cadastro");
          setTimeout(() => {
            this.isSavingGoal = false;
            window.location.reload();
          }, 2000);
        },
        error: (ex) => {
          this.isSavingGoal = false;
          this._handleErrors(ex);
        },
      });
      return;
    }

    // create
    this.goalService.create(this.goal).subscribe({
      next: () => {
        this.toast.success("Meta cadastrada com sucesso", "Cadastro");
        setTimeout(() => {
          this.isSavingGoal = false;
          window.location.reload();
        }, 2000);
      },
      error: (ex) => {
        this.isSavingGoal = false;
        this._handleErrors(ex);
      },
    });
  }

  openAbstinencesModal(): void {
    const modalElement = document.getElementById("abstinencesModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  openAbstinenceCreateModal(): void {
    this.formAbstinence.reset();
    const modalElement = document.getElementById("abstinencesCreateModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeAbstinenceCreateModal(): void {
    this.formAbstinence.reset();
    const modalElement = document.getElementById("abstinencesCreateModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  onSubmitFormAbstinence() {
    this.isSavingAbstinence = true;
    const abstinence = {
      personId: this.personId,
      description: this.formAbstinence.get("description")?.value,
      startDate: this.formAbstinence.get("startDate")?.value,
      endDate: this.formAbstinence.get("endDate")?.value,
    };

    console.log(this.formAbstinence.value);

    if (this.formAbstinence.get("id").value != null) {
      // update
      return;
    }

    // create
    this.appointmentService.createAbstinence(abstinence, this.selectedAbstinenceFile).subscribe({
      next: () => {
        this.toast.success("Atestado médico cadastrado com sucesso", "Cadastro");
        setTimeout(() => {
          this.isSavingAbstinence = false;
          this.closeAbstinenceCreateModal();
          this.location.back();
        }, 2000);
      },
      error: (ex) => {
        this.isSavingAbstinence = false;
        this._handleErrors(ex);
      },
    });
  }

  openVacationsModal(): void {
    const modalElement = document.getElementById("vacationsModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  openVacationCreateModal(): void {
    this.formVacation.reset();
    const modalElement = document.getElementById("vacationsCreateModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.show();
    }
  }

  closeVacationCreateModal(): void {
    this.formVacation.reset();
    const modalElement = document.getElementById("vacationsCreateModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  }

  onSubmitFormVacation() {
    this.isSavingVacation = true;
    this.vacation = this.formVacation.value;
    this.vacation.personId = this.personId;

    if (this.vacation.id) {
      // update
      this.taskService.update(this.task.id, this.task).subscribe({
        next: () => {
          this.toast.success("Férias alteradas com sucesso", "Cadastro");
          setTimeout(() => {
            this.isSavingVacation = false;
            this.closeVacationCreateModal();
            this.location.back();
          }, 2000);
        },
        error: (ex) => {
          this.isSavingVacation = false;
          this._handleErrors(ex);
        },
      });
      return;
    }

    // create
    this.appointmentService.createVacation(this.vacation).subscribe({
      next: () => {
        this.toast.success("Férias cadastradas com sucesso", "Cadastro");
        setTimeout(() => {
          this.isSavingVacation = false;
          this.closeVacationCreateModal();
          this.location.back();
        }, 2000);
      },
      error: (ex) => {
        this.isSavingVacation = false;
        this._handleErrors(ex);
      },
    });
  }

  _handleErrors(ex): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: element.message,
        });
        this.toast.error(element.message);
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ex.error.message,
    });
  }

  formatTodayDates(date1: string, date2: string): { formattedDate1: string; formattedDate2: string } {
    const parsedDate1 = new Date(date1); // "2024-11-23"
    const [day, month, year] = date2.split("/"); // "23/11/2024"
    const parsedDate2 = new Date(`${year}-${month}-${day}`);

    // Formatar ambas as datas para o mesmo formato, como 'dd/MM/yyyy'
    const formattedDate1 = this.datePipe.transform(parsedDate1, "dd/MM/yyyy");
    const formattedDate2 = this.datePipe.transform(parsedDate2, "dd/MM/yyyy");

    return {
      formattedDate1: formattedDate1 || "",
      formattedDate2: formattedDate2 || "",
    };
  }

  onAbstinenceFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedAbstinenceFile = file;
      this.formAbstinence.patchValue({
        document: file,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onVacationFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.selectedVacationFile = file;
      this.formVacation.patchValue({
        document: file,
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

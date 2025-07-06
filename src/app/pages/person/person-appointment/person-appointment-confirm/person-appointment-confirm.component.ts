import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Activity, Appointment } from "src/app/models/appointment";
import { AppointmentService } from "src/app/services/appointment.service";
import { Location } from "@angular/common";
import { AuthService } from "src/app/services/auth.service";

export interface DialogData {
  tagId: string;
  activityId: string;
  appointmentId: string;
  personId: string;
  activityType: string;
  activity: Activity;
  selected: Date;
  description?: string;
  justification?: string;
}

@Component({
  selector: "app-person-appointment-confirm",
  templateUrl: "./person-appointment-confirm.component.html",
  styleUrls: ["./person-appointment-confirm.component.css"],
})
export class PersonAppointmentConfirmComponent implements OnInit {
  appointment: Appointment = {
    id: "",
    name: "",
    person: null,
    personId: "",
    tag: null,
    tagId: "",
    activityType: "",
    description: "",
    justification: "",
    activityId: "",
    routineId: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
    type: 0,
  };
  isAdmin: boolean = false;
  isAdminGeral: boolean = false;
  isAdminEmpresa: boolean = false;
  isAdminOffice: boolean = false;
  isSupervisor: boolean = false;
  isUserOffice: boolean = false;
  isGuest: boolean = false;
  userRole: string[] = [];
  description: FormControl = new FormControl(null, Validators.minLength(3));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private appointmentService: AppointmentService,
    private toast: ToastrService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this._checkPermission();
    if (this.data.activity.description != null) {
      this.appointment.description = this.data.activity.description;
      this.appointment.justification = this.data.activity.justification;
    }
  }

  public save(): void {
    console.log("aqui");

    this.appointment.id = this.data.appointmentId;
    this.appointment.personId = this.data.personId;
    this.appointment.tagId = this.data.tagId;
    this.appointment.activityId = this.data.activityId;
    this.appointment.activityType = this.data.activityType;
    this.appointment.createdAt = this.data.selected.toISOString();
    this.appointmentService.createByDate(this.appointment).subscribe({
      next: () => {
        this.toast.success("Avaliação criada com sucesso", "Cadastro");
        this.location.back();
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  public delete(): void {
    this.appointmentService.delete(this.data.appointmentId).subscribe({
      next: () => {
        this.toast.success("Avaliação desativada com sucesso");
        this.location.back();
      },
      error: (ex) => {
        this.toast.error("Houve um erro no servidor para deletar a ocorrência.");
      },
    });
  }

  public validateFields(): boolean {
    return this.description.valid;
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

  private _checkPermission(): void {
    this.userRole = this.authService.getRole();
    this.userRole.map((role) => {
      switch (role) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          break;
        case "ROLE_ADMIN_GERAL":
          this.isAdminGeral = true;
          break;
        case "ROLE_ADMIN_COMPANY":
          this.isAdminEmpresa = true;
          break;
        case "ROLE_ADMIN_OFFICE":
          this.isAdminOffice = true;
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          break;
        case "ROLE_USER_OFFICE":
          this.isUserOffice = true;
          break;
        default:
          this.isGuest = true;
          break;
      }
    });
  }
}

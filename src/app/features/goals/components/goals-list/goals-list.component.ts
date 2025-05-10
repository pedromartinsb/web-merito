import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { GoalsService } from "../../services/goals.service";
import { Goal } from "src/app/models/goal";
import { AuthService } from "src/app/services/auth.service";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-goals-list",
  templateUrl: "./goals-list.component.html",
  styleUrls: ["./goals-list.component.css"],
})
export class GoalsListComponent implements OnInit {
  goalHeaders = ["Id", "Título", "PersonId", "Funcionário", "Cargo", "Status", "Data"];
  goalData = [];
  loading: boolean = true; // Estado de carregamento

  userRole: string[] = [];
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  constructor(
    private goalsService: GoalsService,
    private toast: ToastrService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this._checkPermission();
  }

  private _checkPermission(): void {
    this.userRole = this.authService.getRole();
    this.userRole.map((role) => {
      switch (role) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          this._findGoalsByOffice();
          this.goalData.sort((a, b) => a.startDate.localeCompare(b.startDate));
          break;
        case "ROLE_MANAGER":
          this.isManager = true;
          this._findGoalsByOffice();
          this.goalData.sort((a, b) => a.startDate.localeCompare(b.startDate));
          break;
        case "ROLE_USER":
          this.isUser = true;
          this._findGoalsByUser();
          this.goalData.sort((a, b) => a.startDate.localeCompare(b.startDate));
          break;
      }
    });
  }

  private _findGoalsByUser(): void {
    this.goalsService.findAll().subscribe({
      next: (goals) => {
        if (goals != null) {
          goals.forEach((response) => {
            const goal = [
              response.id,
              response.title,
              response.person.id,
              response.person.name,
              response.person.responsibility.name,
              response.status,
              formatDate(response.startDate, "dd/MM/yyyy", "en-US"),
            ];
            this.goalData.push(goal);
          });
          this.loading = false;
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => (this.loading = false),
    });
  }

  private _findGoalsByOffice() {
    this.goalsService.findAllByOffice().subscribe({
      next: (goals) => {
        if (goals != null) {
          goals.forEach((response) => {
            const goal = [
              response.id,
              response.title,
              response.person.id,
              response.person.name,
              response.person.responsibility.name,
              response.status,
              formatDate(response.startDate, "dd/MM/yyyy", "en-US"),
            ];
            this.goalData.push(goal);
          });
          this.loading = false;
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => (this.loading = false),
    });
  }

  onFinish(row: any) {
    console.log(row);
    this.goalsService.finish(row[0]).subscribe({
      next: () => {
        window.location.reload();
        this.toast.success("Meta concluída com sucesso.");
      },
      error: (error: Error) => {
        this._handleErrors(error);
      },
    });
  }

  onEdit(row: any) {
    this.router.navigate(["/goals/edit/", row[0]]);
  }

  onDelete(row: any) {
    this.goalsService.cancel(row[0]).subscribe({
      next: () => {
        window.location.reload();
        this.toast.success("Meta cancelada com sucesso.");
      },
      error: (error: Error) => {
        this._handleErrors(error);
      },
    });
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

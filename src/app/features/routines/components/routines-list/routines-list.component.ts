import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RoutinesService } from "../../services/routines.service";
import { AuthService } from "src/app/services/auth.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-routines-list",
  templateUrl: "./routines-list.component.html",
  styleUrls: ["./routines-list.component.css"],
})
export class RoutinesListComponent implements OnInit {
  routinesHeaders = ["Id", "Nome", "Cargo"];
  routinesData = [];
  loading: boolean = true;

  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  constructor(
    private authService: AuthService,
    private routinesService: RoutinesService,
    private toast: ToastrService,
    public router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRoles().map((role) => {
      switch (role.name) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          this.loadRoutinesData();
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          this.loadRoutinesData();
          break;
        case "ROLE_MANAGER":
          this.isManager = true;
          this.loadRoutinesData();
          break;
        case "ROLE_USER":
          this.isUser = true;
          this.loadRoutinesByUser();
          break;
        default:
          this.isUser = true;
      }
    });
  }

  private loadRoutinesData(): void {
    this.loading = true;
    this.routinesService.findAll().subscribe({
      next: (routines) => {
        if (routines != null) {
          routines.forEach((response) => {
            const routine = [response.id, response.name, response.responsibility.name];
            this.routinesData.push(routine);
          });
          this.toast.success("Pesquisa realizada com sucesso.");
          this.loading = false;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorHandlerService.handle(error, "Erro ao buscar rotinas");
      },
    });
  }

  private loadRoutinesByUser(): void {
    this.loading = true;
    this.routinesService.findAll().subscribe({
      next: (routines) => {
        if (routines != null) {
          routines.forEach((response) => {
            const routine = [response.id, response.name, response.responsibility.name];
            this.routinesData.push(routine);
          });
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandlerService.handle(error, "Erro ao buscar rotinas");
      },
    });
  }

  public onEdit(row: any): void {
    const id = row[0];
    this.router.navigate(["/routines/edit/", id]);
  }

  public onDelete(row: any): void {
    const id = row[0];
    const name = row[1];
    Swal.fire({
      title: `Tem certeza que deseja desativar a rotina \"${name}\"?`,
      text: "Você não poderá voltar atrás após desativar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar agora!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.routinesService.delete(id).subscribe({
          next: () => {
            this.toast.success(`A rotina ${name} foi desativada com sucesso.`);
            this.loading = false;
            window.location.reload();
          },
          error: (error) => {
            this.loading = false;
            this.errorHandlerService.handle(error, "Erro ao deletar rotina selecionada.");
          },
        });
      }
    });
  }
}

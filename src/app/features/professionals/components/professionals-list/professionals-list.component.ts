import { Component, OnInit } from "@angular/core";
import { ProfessionalsService } from "../../services/professionals.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Urls } from "../../../../config/urls.config";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-professionals-list",
  templateUrl: "./professionals-list.component.html",
  styleUrls: ["./professionals-list.component.css"],
})
export class ProfessionalsListComponent implements OnInit {
  professionalsHeaders = ["Id", "Foto", "Nome", "Cargo", "Permissão"];
  professionalsData = [];
  loading: boolean = true;
  deleting: boolean = false;

  userRole: string[] = [];
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  constructor(
    private professionalService: ProfessionalsService,
    private toast: ToastrService,
    private authService: AuthService,
    public router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getUserRoles();
    this.loadProfessionalsData();
  }

  private getUserRoles(): void {
    this.authService.getUserRoles().forEach((role) => {
      console.log(role.name);
      switch (role.name) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          break;
        case "ROLE_MANAGER":
          this.isManager = true;
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          break;
        case "ROLE_USER":
          this.isUser = true;
          break;
        default:
          this.isUser = true;
      }
    });
  }

  private loadProfessionalsData(): void {
    this.professionalService.findAllByContractType("Professional").subscribe({
      next: (professionals) => {
        if (professionals != null) {
          professionals.forEach((response) => {
            response.picture = response.picture == null ? Urls.getDefaultPictureS3() : response.picture;
            let accessType =
              response.accessType == "Manager" ? "Gerente" : response.accessType == "User" ? "Usuário" : "Supervisor";
            const professional = [
              response.id,
              response.picture,
              response.name,
              response.responsibilityName,
              accessType,
            ];
            this.professionalsData.push(professional);
          });
        }
        this.loading = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.loading = false;
      },
    });
  }

  // Métodos para emitir os eventos de ação
  onEdit(professional: any) {
    console.log(professional);
    const id = professional[0];
    this.router.navigate(["/professionals/edit/", id]);
  }

  public onDelete(row: any): void {
    const id = row[0];
    const name = row[2];
    Swal.fire({
      title: `Tem certeza que deseja desativar o(a) profissional autônomo(a) \"${name}\"?`,
      text: "Você não poderá voltar atrás após desativar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar agora!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleting = true;
        this.professionalService.delete(id).subscribe({
          next: () => {
            this.toast.success(`O(A) profissional autônomo(a) ${name} foi desativado(a) com sucesso.`);
            this.deleting = false;
            window.location.reload();
          },
          error: (error) => {
            this.deleting = false;
            this.errorHandlerService.handle(error, "Erro ao deletar profissional autônomo(a) selecionado(a).");
          },
        });
      }
    });
  }

  onView(row: any) {
    console.log(row);
  }

  private _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }
}

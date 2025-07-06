import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { OfficeService } from "src/app/services/office.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

interface Office {
  id: string;
  name: string;
}

@Component({
  selector: "app-select-company",
  templateUrl: "./select-company.component.html",
  styleUrls: ["./select-company.component.scss"],
})
export class SelectCompanyComponent implements OnInit {
  offices: Office[] = [];
  selected: string | null = null;

  constructor(
    private router: Router,
    private toast: ToastrService,
    private errorHandler: ErrorHandlerService,
    private officeService: OfficeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOfficies();
  }

  private loadOfficies(): void {
    this.officeService.findAll().subscribe({
      next: (offices) => {
        this.offices = offices;
      },
      error: (error) => this.errorHandler.handle(error, "Erro ao carregar lista de empresas."),
    });
  }

  selectOffice(currentCompanyId: string): void {
    this.selected = currentCompanyId;
  }

  public proceed(): void {
    if (this.selected === null || this.selected === "") {
      this.toast.error("Selecione uma empresa para avançar.");
      return;
    }
    this.authService.setCurrentCompanyIdToCurrentUser(this.selected);
    const roles = this.authService.getUserRoles();
    this.toast.success("Login efetuado com sucesso!");
    roles.map((role) => {
      switch (role.name) {
        case "ROLE_ADMIN":
        case "ROLE_MANAGER":
        case "ROLE_SUPERVISOR":
          this.router.navigate(["/inicio/gerente"]);
          return;
        case "ROLE_USER":
          this.router.navigate(["/inicio/usuario"]);
          return;
        default:
          this.router.navigate(["/inicio/usuario"]);
      }
    });
  }
}

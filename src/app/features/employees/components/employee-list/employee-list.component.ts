import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "../../services/employee.service";
import { ToastrService } from "ngx-toastr";
import { Urls } from "src/app/config/urls.config";
import { AuthService } from "src/app/services/auth.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import Swal from "sweetalert2";

interface RoleResponse {
  name: string;
}

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  employeeHeaders = ["Id", "Foto", "Nome", "Cargo", "Permissão"];
  employeeData = [];

  userRoles: RoleResponse[] = [];
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  userForm: FormGroup;
  loading: boolean = true; // Estado de carregamento
  deleting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService,
    public router: Router,
    private toast: ToastrService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.userForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadEmployeeData();
    this.getUserRoles();
  }

  private getUserRoles(): void {
    this.authService.getUserRoles().forEach((role) => {
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

  private loadEmployeeData(): void {
    this.employeeService.findAllByContractType("CLT").subscribe({
      next: (employees) => {
        if (employees != null) {
          employees.forEach((response) => {
            response.picture = response.picture == null ? Urls.getDefaultPictureS3() : response.picture;
            let accessType =
              response.accessType == "Manager"
                ? "Gerente"
                : response.accessType == "User"
                ? "Usuário"
                : response.accessType == "Supervisor"
                ? "Supervisor"
                : "";
            const employee = [response.id, response.picture, response.name, response.responsibilityName, accessType];
            this.employeeData.push(employee);
          });
        }
      },
      error: (error) => this.errorHandlerService.handle(error, "Não foi possível buscar os funcionários"),
      complete: () => (this.loading = false),
    });
  }

  onEdit(employee: any) {
    const id = employee[0];
    this.router.navigate(["/employees/edit/", id]);
  }

  public onDelete(row: any): void {
    const id = row[0];
    const name = row[2];
    Swal.fire({
      title: `Tem certeza que deseja desativar o(a) funcionário(a) \"${name}\"?`,
      text: "Você não poderá voltar atrás após desativar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar agora!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleting = true;
        this.employeeService.delete(id).subscribe({
          next: () => {
            this.toast.success(`O(A) funcionário(a) ${name} foi desativado(a) com sucesso.`);
            this.deleting = false;
            window.location.reload();
          },
          error: (error) => {
            this.deleting = false;
            this.errorHandlerService.handle(error, "Erro ao deletar funcionário(a) selecionado(a).");
          },
        });
      }
    });
  }

  onView(row: any) {
    console.log(row);
  }
}

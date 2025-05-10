import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmployeeService } from "../../services/employee.service";
import { ToastrService } from "ngx-toastr";
import { Urls } from "src/app/config/urls.config";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-employee-list",
  templateUrl: "./employee-list.component.html",
  styleUrls: ["./employee-list.component.css"],
})
export class EmployeeListComponent implements OnInit {
  employeeHeaders = ["Id", "Foto", "Nome", "Cargo", "Permissão"];
  employeeData = [];

  userRole: string[] = [];
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
    private toast: ToastrService
  ) {
    this.userForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this._cleanEmployeeData();

    this.userRole = this.authService.getRole();
    this._checkPermission();

    this.employeeService.findAllEmployees().subscribe({
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
        this.loading = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.loading = false;
      },
    });
  }

  private _cleanEmployeeData() {
    this.employeeData = [];
  }

  private _checkPermission(): void {
    this.userRole.map((role) => {
      switch (role) {
        case "ROLE_ADMIN":
          this.isAdmin = true;
          break;
        case "ROLE_SUPERVISOR":
          this.isSupervisor = true;
          break;
        case "ROLE_MANAGER":
          this.isManager = true;
          break;
        case "ROLE_USER":
          this.isUser = true;
          break;
      }
    });
  }

  onEdit(employee: any) {
    const id = employee[0];
    this.router.navigate(["/employees/edit/", id]);
  }

  onDelete(row: any) {
    this.deleting = true;
    this.employeeService.delete(row[0]).subscribe({
      next: () => {
        this.toast.success("Funcionário desativado com sucesso!");
        this.loading = false;
        window.location.reload();
        this.deleting = false;
      },
      error: (ex) => {
        this._handleErrors(ex);
        this.deleting = false;
      },
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

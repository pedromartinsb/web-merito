import { Component, OnInit } from "@angular/core";
import { SuppliersService } from "../../services/suppliers.service";
import { Urls } from "../../../../config/urls.config";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-suppliers-list",
  templateUrl: "./suppliers-list.component.html",
  styleUrls: ["./suppliers-list.component.css"],
})
export class SuppliersListComponent implements OnInit {
  suppliersHeaders = ["Id", "Foto", "Nome", "Cargo", "Permissão"];
  suppliersData = [];

  loading: boolean = true;
  deleting: boolean = false;

  userRole: string[] = [];
  isAdmin: boolean = false;
  isSupervisor: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  constructor(
    private supplierService: SuppliersService,
    private toast: ToastrService,
    private authService: AuthService,
    public router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getUserRoles();
    this.loadSuppliers();
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

  private loadSuppliers(): void {
    this.supplierService.findAllByContractType("Supplier").subscribe({
      next: (suppliers) => {
        if (suppliers != null) {
          suppliers.forEach((response) => {
            response.picture = response.picture == null ? Urls.getDefaultPictureS3() : response.picture;
            let accessType =
              response.accessType == "Manager" ? "Gerente" : response.accessType == "User" ? "Usuário" : "Supervisor";
            const supplier = [response.id, response.picture, response.name, response.responsibilityName, accessType];
            this.suppliersData.push(supplier);
          });
        }
      },
      error: (error) => this.errorHandlerService.handle(error, "Erro ao carregar os Prestadores de Serviços"),
      complete: () => (this.loading = false),
    });
  }

  // Métodos para emitir os eventos de ação
  onEdit(employee: any) {
    const id = employee[0];
    this.router.navigate(["/suppliers/edit/", id]);
  }

  public onDelete(row: any): void {
    const id = row[0];
    const name = row[2];
    Swal.fire({
      title: `Tem certeza que deseja desativar o(a) fornecedor(a) \"${name}\"?`,
      text: "Você não poderá voltar atrás após desativar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar agora!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleting = true;
        this.supplierService.delete(id).subscribe({
          next: () => {
            this.toast.success(`O(A) fornecedor(a) ${name} foi desativado(a) com sucesso.`);
            this.deleting = false;
            window.location.reload();
          },
          error: (error) => {
            this.deleting = false;
            this.errorHandlerService.handle(error, "Erro ao deletar fornecedor(a) selecionado(a).");
          },
        });
      }
    });
  }

  onView(row: any) {
    console.log(row);
  }
}

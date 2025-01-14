import {Component, OnInit} from '@angular/core';
import {SuppliersService} from "../../services/suppliers.service";
import {Urls} from "../../../../config/urls.config";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit {
  suppliersHeaders = [
    'Id',
    'Foto',
    'Nome',
    'Cargo',
    'Permissão'
  ];
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
     public router: Router
    ) { }

  ngOnInit(): void {
    this._checkPermission();
    this._suppliers();
  }

  private _checkPermission(): void {
    this.userRole = this.authService.getRole();
    this.userRole.map((role) => {
      switch (role) {
        case 'ROLE_ADMIN':
          this.isAdmin = true;
          break;
        case 'ROLE_SUPERVISOR':
          this.isSupervisor = true;
          break;
        case 'ROLE_MANAGER':
          this.isManager = true;
          break;
        case 'ROLE_USER':
          this.isUser = true;
          break;
        default:
          this.isUser = true;
      }
    });
  }

  private _suppliers() {
    this.supplierService.findAllSuppliers().subscribe({
      next: (suppliers) => {
        if (suppliers != null) {
          suppliers.forEach((response) => {
            response.picture = response.picture == null ? Urls.getDefaultPictureS3() : response.picture;
            let accessType = (response.accessType == "Manager") ? ("Gerente") : ((response.accessType == "User") ? ("Usuário") : ("Supervisor"));
            const supplier = [
              response.id,
              response.picture,
              response.name,
              response.responsibilityName,
              accessType
            ];
            this.suppliersData.push(supplier);
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
  onEdit(employee: any) {
    const id = employee[0];
    this.router.navigate(['/suppliers/edit/', id]);
  }

  onDelete(row: any) {
    this.deleting = true;
    this.supplierService.delete(row[0])
    .subscribe({
      next: () => {
        setTimeout(() => {
          this.toast.success('Fornecedor desativado com sucesso!');
          this.loading = false;
          window.location.reload();
          this.deleting = false;
        }, 2000);
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

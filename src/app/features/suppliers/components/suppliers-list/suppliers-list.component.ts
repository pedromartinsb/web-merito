import {Component, OnInit} from '@angular/core';
import {SuppliersService} from "../../services/suppliers.service";
import {Urls} from "../../../../config/urls.config";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

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
  ];
  suppliersData = [];
  loading: boolean = true;
  deleting: boolean = false;

  constructor(private supplierService: SuppliersService, private toast: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this._suppliers();
  }

  private _suppliers() {
    this.supplierService.findAllSuppliers().subscribe({
      next: (suppliers) => {
        if (suppliers != null) {
          suppliers.forEach((response) => {
            if (response.picture == null) {
              response.picture = Urls.getDefaultPictureS3();
            }
            const supplier = [
              response.id,
              response.picture,
              response.name,
              response.responsibilityName
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

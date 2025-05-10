import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ResponsibilitiesService } from "../../services/responsibilities.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-responsibilities-list",
  templateUrl: "./responsibilities-list.component.html",
  styleUrls: ["./responsibilities-list.component.css"],
})
export class ResponsibilitiesListComponent implements OnInit {
  responsibilitiesHeaders = ["Id", "Nome do Cargo", "Empresa"];
  responsibilitiesData = [];
  loading: boolean = true; // Estado de carregamento
  officeId: string;

  constructor(
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.officeId = localStorage.getItem("officeId");
    this._responsibilities();
  }

  _responsibilities() {
    this.responsibilitiesService.findByOffice(this.officeId).subscribe({
      next: (responsibilities) => {
        if (responsibilities != null) {
          responsibilities.forEach((response) => {
            const responsibility = [response.id, response.name, response.officeFantasyName];
            this.responsibilitiesData.push(responsibility);
          });
          this.loading = false;
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => (this.loading = false),
    });
  }

  onEdit(row: any) {
    this.router.navigate(["/responsibilities/edit/", row[0]]);
  }

  onDelete(row: any) {
    Swal.fire({
      title: "Tem certeza que deseja desativar?",
      text: "Você não poderá voltar atrás após desativar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar agora!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.responsibilitiesService.delete(row[0]).subscribe({
          next: () => {
            Swal.fire({
              title: "Desativado!",
              text: "O registro foi desativado com sucesso.",
              icon: "success",
            });
            this.loading = false;
          },
          error: (ex) => {
            this.loading = false;
            this._handleErrors(ex);
          },
        });
      }
    });
  }

  _handleErrors(ex): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: element.message,
        });
        this.toast.error(element.message);
      });
      return;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: ex.error.message,
    });
  }
}

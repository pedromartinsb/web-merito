import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ResponsibilitiesService } from "../../services/responsibilities.service";
import Swal from "sweetalert2";
import { ErrorHandlerService } from "src/app/shared/error-handler.service";

@Component({
  selector: "app-responsibilities-list",
  templateUrl: "./responsibilities-list.component.html",
  styleUrls: ["./responsibilities-list.component.css"],
})
export class ResponsibilitiesListComponent implements OnInit {
  responsibilitiesHeaders = ["Id", "Nome do Cargo", "Empresa"];
  responsibilitiesData = [];
  loading: boolean = true;

  constructor(
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService,
    public router: Router,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadResponsibilitiesData();
  }

  private loadResponsibilitiesData(): void {
    this.responsibilitiesService.findAll().subscribe({
      next: (responsibilities) => {
        if (responsibilities != null) {
          responsibilities.forEach((response) => {
            const responsibility = [response.id, response.name, response.officeFantasyName];
            this.responsibilitiesData.push(responsibility);
          });
        }
        this.toast.success("Pesquisa realizada com sucesso.");
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandlerService.handle(error, "Erro ao buscar Cargos");
      },
    });
  }

  onEdit(row: any): void {
    const id = row[0];
    this.router.navigate(["/responsibilities/edit/", id]);
  }

  onDelete(row: any): void {
    const id = row[0];
    const name = row[1];
    Swal.fire({
      title: `Tem certeza que deseja desativar o cargo \"${name}\"?`,
      text: "Você não poderá voltar atrás após desativar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, desativar agora!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.responsibilitiesService.delete(id).subscribe({
          next: () => {
            this.toast.success(`O cargo ${name} foi desativado com sucesso.`);
            this.loading = false;
            window.location.reload();
          },
          error: (error) => {
            this.loading = false;
            this.errorHandlerService.handle(error, "Erro ao deletar cargo selecionado.");
          },
        });
      }
    });
  }
}

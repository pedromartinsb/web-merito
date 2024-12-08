import { Component, OnInit } from '@angular/core';
import {ProfessionalsService} from "../../services/professionals.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Urls} from "../../../../config/urls.config";

@Component({
  selector: 'app-professionals-list',
  templateUrl: './professionals-list.component.html',
  styleUrls: ['./professionals-list.component.css']
})
export class ProfessionalsListComponent implements OnInit {
  professionalsHeaders = [
    'Id',
    'Foto',
    'Nome',
    'Cargo',
  ];
  professionalsData = [];
  loading: boolean = true;
  deleting: boolean = false;

  constructor(private professionalService: ProfessionalsService, private toast: ToastrService, public router: Router) { }

  ngOnInit(): void {
    this._professionals();
  }

  private _professionals() {
    this.professionalService.findAllSuppliers().subscribe({
      next: (professionals) => {
        if (professionals != null) {
          professionals.forEach((response) => {
            if (response.picture == null) {
              response.picture = Urls.getDefaultPictureS3();
            }
            const professional = [
              response.id,
              response.picture,
              response.name,
              response.responsibility.name
            ];
            console.log(response)
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
    this.router.navigate(['/professionals/edit/', id]);
  }

  onDelete(row: any) {
    this.deleting = true;
    this.professionalService.delete(row[0])
    .subscribe({
      next: () => {
        this.toast.success('Profissional desativado com sucesso!');
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

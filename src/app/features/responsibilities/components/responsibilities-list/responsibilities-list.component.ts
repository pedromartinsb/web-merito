import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsibilitiesService } from '../../services/responsibilities.service';

@Component({
  selector: 'app-responsibilities-list',
  templateUrl: './responsibilities-list.component.html',
  styleUrls: ['./responsibilities-list.component.css']
})
export class ResponsibilitiesListComponent implements OnInit {
  responsibilitiesHeaders = [
    'Id',
    'Nome do Cargo',
    'Empresa'
  ];
  responsibilitiesData = [];
  loading: boolean = true; // Estado de carregamento

  constructor(
    private responsibilitiesService: ResponsibilitiesService,
    private toast: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this._responsibilities();
  }

  _responsibilities() {
    this.responsibilitiesService.findAllResponsibilities().subscribe({
      next: (responsibilities) => {
        if (responsibilities != null) {
          responsibilities.forEach((response) => {
            console.log(response)
            const responsibility = [
              response.id,
              response.name,
              response.officeFantasyName
            ];
            this.responsibilitiesData.push(responsibility);
          });
          this.loading = false;
        }
      },
      error: (ex) => this._handleErrors(ex),
      complete: () => this.loading = false
    });
  }

  onEdit(row: any) {
    this.router.navigate(['/responsibilities/edit/', row[0]]);
  }

  onDelete(row: any) {

  }

  _handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

}

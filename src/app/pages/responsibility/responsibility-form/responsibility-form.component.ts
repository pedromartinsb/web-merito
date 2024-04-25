import { ResponsibilityService } from '../../../services/responsibility.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Responsibility } from 'src/app/models/responsibility';
import { Location } from '@angular/common';
import { Company } from 'src/app/models/company';
import { CompanyService } from 'src/app/services/company.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-responsibility-form',
  templateUrl: './responsibility-form.component.html',
  styleUrls: ['./responsibility-form.component.css'],
})
export class ResponsibilityFormComponent implements OnInit {
  responsibility: Responsibility = {
    name: '',
    company: null,
    companyId: '',
    routines: [],
    createdAt: '',
    updatedAt: '',
    deletedAt: '',
  };

  companies: Company[] = [];

  responsibilityId: string;
  companyId: string;

  name: FormControl = new FormControl(null, Validators.minLength(3));
  company: FormControl = new FormControl(null, Validators.required);

  public isSaving: boolean = false;

  constructor(
    private responsibilityService: ResponsibilityService,
    private companyService: CompanyService,
    private router: Router,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.responsibilityId = this.route.snapshot.params['id'];
    this.companyId = this.route.snapshot.params['companyId'];
    if (this.responsibilityId) {
      this.loadResponsibility();
    } else {
      this.findAllCompanies();
    }
  }

  backClicked() {
    this._location.back();
  }

  loadResponsibility(): void {
    this.responsibilityService
      .findById(this.responsibilityId)
      .pipe(
        finalize(() => {
          this.findAllCompanies();
        })
      )
      .subscribe((response) => {
        this.responsibility = response;
      });
  }

  findAllCompanies(): void {
    this.companyService.findAll().subscribe((response: Company[]) => {
      this.companies = response;

      if (this.responsibilityId) {
        this.company.setValue(
          response.find((p) => p.id === this.responsibility.company.id)
        );
        this.responsibility.companyId = this.responsibility.company.id;
      }
    });
  }

  openResponsibilityForm(): void {
    if (this.responsibilityId) {
      this.updateResponsibility();
    } else {
      this.createResponsibility();
    }
  }

  private createResponsibility(): void {
    this.isSaving = true;
    this.responsibilityService.create(this.responsibility).subscribe({
      next: () => {
        this.toast.success('Função cadastrada com sucesso', 'Cadastro');
        this.router.navigate(['responsibility']);
        this.isSaving = false;
      },
      error: (ex) => {
        this.handleErrors(ex);
      },
    });
  }

  private updateResponsibility(): void {
    this.isSaving = true;
    this.responsibilityService
      .update(this.responsibilityId, this.responsibility)
      .subscribe({
        next: () => {
          this.toast.success('Função atualizada com sucesso', 'Atualização');
          this.router.navigate(['responsibility']);
          this.isSaving = false;
        },
        error: (ex) => {
          this.handleErrors(ex);
        },
      });
  }

  private handleErrors(ex: any): void {
    if (ex.error.errors) {
      ex.error.errors.forEach((element) => {
        this.toast.error(element.message);
      });
    } else {
      this.toast.error(ex.error.message);
    }
  }

  validateFields(): boolean {
    return this.name.valid;
  }
}
